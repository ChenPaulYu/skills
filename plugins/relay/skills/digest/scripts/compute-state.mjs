#!/usr/bin/env node
// relay:digest — collect GitHub primitives, then reduce them to viewer obligations.
// Collection is intentionally separate from the deterministic reducer: fixture JSON
// exercises semantics without network access, while live use shells out only to `gh`.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 3;

const loginOf = (actor) => typeof actor === 'string' ? actor : actor?.login || actor?.slug || null;
const sameLogin = (left, right) => Boolean(left && right && left.toLowerCase() === right.toLowerCase());
const unique = (values) => [...new Set(values.filter(Boolean))];
const hasLabel = (object, label) => (object.labels || []).some((value) =>
  (typeof value === 'string' ? value : value?.name)?.toLowerCase() === label.toLowerCase());
const isOpen = (object) => object.closed !== true && (!object.state || object.state.toUpperCase() === 'OPEN');
const objectKey = (object) => object.id || object.url || object.number;

function objectRef(object) {
  return {
    objectType: object.type,
    number: object.number ?? null,
    title: object.title || '',
    url: object.url || null,
  };
}

function obligation(kind, object, reason, action, extra = {}) {
  return {
    id: `${kind.toLowerCase()}:${objectKey(object)}`,
    kind,
    ...objectRef(object),
    reasons: [reason],
    action,
    ...extra,
  };
}

/** Every @mention in one text, lowercased, in appearance order. The @ must not be preceded
 * by a word character or a dot, so `hello@rytho.ai` never reads as a mention of `rytho`,
 * and the handle itself must start alnum, so `@-junk` is never a valid GitHub login. */
function findAllMentions(text) {
  const regex = /(^|[^\w.@])@([A-Za-z0-9][A-Za-z0-9-]*)/g;
  const handles = [];
  let match;
  while ((match = regex.exec(text || '')) !== null) handles.push(match[2].toLowerCase());
  return handles;
}

function firstMention(text) {
  return findAllMentions(text)[0] || null;
}

/** Every @mention across an object's title, body, and comment bodies, excluding any
 * mention inside text the viewer themselves authored (title/body -> object author;
 * comment -> comment author) — the notice-tier scan is find-all, unlike the ACK
 * recipient's first-mention-wins rule above, but a self-mention is not a notice-worthy
 * signal: naming yourself in your own text is not someone pinging you (F4). A source
 * with no resolvable author is never treated as self-authored, so it still counts. */
function mentionsOfOthers(object, viewer) {
  const sources = [
    { text: object.title, author: object.author },
    { text: object.body, author: object.author },
    ...(object.comments || []).map((comment) => ({ text: comment.body, author: comment.author })),
  ];
  return unique(
    sources
      .filter((source) => !sameLogin(loginOf(source.author), viewer))
      .flatMap((source) => findAllMentions(source.text)),
  );
}

function designatedAckRecipient(object) {
  if (object.ackRecipient) return loginOf(object.ackRecipient);
  if (!/^\s*\[ACK\]/i.test(object.title || '') && !hasLabel(object, 'ack-required')) return null;
  // The first @mention (title first, then body) names the recipient; later mentions are context.
  return firstMention(object.title) || firstMention(object.body);
}

function hasEyesFrom(object, viewer) {
  return (object.reactions || []).some((reaction) =>
    ['EYES', 'eyes', '👀'].includes(reaction.content) && sameLogin(loginOf(reaction.user), viewer));
}

function reviewState(review) {
  return String(review.state || review.verdict || '').toUpperCase();
}

function reviewRevision(review) {
  return review.revision || review.commitSha || review.commit?.oid || null;
}

function requestedReviewers(object) {
  return unique([
    ...(object.requestedReviewers || []).map(loginOf),
    ...(object.reviewRequests || []).filter((request) => request.active !== false).map((request) => loginOf(request.reviewer || request.requestedReviewer)),
  ]);
}

function wasDesignatedReviewer(object, viewer) {
  return requestedReviewers(object).some((login) => sameLogin(login, viewer)) ||
    (object.reviewRequests || []).some((request) => sameLogin(loginOf(request.reviewer || request.requestedReviewer), viewer));
}

/** True when this object already carries a FORMAL signal for the viewer — designated ACK
 * recipient, requested reviewer (active or withdrawn history), or assignee — regardless of
 * whether that round is already complete. A completed round (eyes added, verdict given)
 * must not resurface as a standing mentioned-in-prose notice forever (F1): the object still
 * names the viewer, so the mention scan would otherwise keep firing after the work is done,
 * exactly the noise ADR-090 retired the old startup-digest hook to avoid. */
function hasFormalSignal(object, viewer) {
  const recipient = designatedAckRecipient(object);
  if (recipient && sameLogin(recipient, viewer)) return true;
  if (wasDesignatedReviewer(object, viewer)) return true;
  if ((object.assignees || []).map(loginOf).some((login) => sameLogin(login, viewer))) return true;
  return false;
}

function currentRevisionOf(object) {
  return object.currentRevision || object.headSha || object.headRefOid || null;
}

function reviewNeed(object, viewer) {
  const reviews = (object.reviews || [])
    .filter((review) => sameLogin(loginOf(review.author || review.user), viewer))
    .sort((a, b) => String(a.submittedAt || '').localeCompare(String(b.submittedAt || '')));
  const currentRevision = currentRevisionOf(object);
  const currentVerdict = reviews.findLast((review) =>
    reviewRevision(review) === currentRevision && ['APPROVED', 'CHANGES_REQUESTED'].includes(reviewState(review)));
  if (currentVerdict) return null;

  const currentRequest = requestedReviewers(object).some((login) => sameLogin(login, viewer));
  const staleVerdict = reviews.findLast((review) =>
    reviewRevision(review) !== currentRevision && ['APPROVED', 'CHANGES_REQUESTED'].includes(reviewState(review)));
  const onlyCommented = reviews.some((review) => reviewState(review) === 'COMMENTED');
  const designated = wasDesignatedReviewer(object, viewer);

  if (!currentRequest && !staleVerdict && !(designated && onlyCommented)) return null;
  const reasons = [];
  if (currentRequest) reasons.push('review-requested');
  if (staleVerdict) reasons.push('stale-verdict');
  if (designated && onlyCommented) reasons.push('comment-is-not-verdict');
  return {
    reasons: unique(reasons),
    action: staleVerdict || !currentRequest ? 're-review-current-revision' : 'submit-current-revision-verdict',
    currentRevision,
  };
}

/** Latest verdict (APPROVED/CHANGES_REQUESTED) per reviewer login, on one specific revision.
 * Shared by currentChangeRequest and approvalReadyFromReviews so both read the same
 * per-reviewer, per-revision machinery reviewNeed already relies on above. */
function verdictsOnRevision(object, revision) {
  const byAuthor = new Map();
  const sorted = (object.reviews || [])
    .filter((review) => reviewRevision(review) === revision && ['APPROVED', 'CHANGES_REQUESTED'].includes(reviewState(review)))
    .sort((a, b) => String(a.submittedAt || '').localeCompare(String(b.submittedAt || '')));
  for (const review of sorted) {
    const login = loginOf(review.author || review.user);
    if (login) byAuthor.set(login.toLowerCase(), reviewState(review));
  }
  return byAuthor;
}

function currentChangeRequest(object) {
  return [...verdictsOnRevision(object, currentRevisionOf(object)).values()].includes('CHANGES_REQUESTED');
}

/** Approval readiness derived from per-reviewer, per-revision verdicts — used when the
 * aggregate reviewDecision is null/empty, which GitHub returns whenever the base branch
 * has no branch-protection rule (e.g. private free-plan repos). */
function approvalReadyFromReviews(object) {
  const verdicts = verdictsOnRevision(object, currentRevisionOf(object));
  const states = [...verdicts.values()];
  if (!states.includes('APPROVED')) return false;
  if (states.includes('CHANGES_REQUESTED')) return false;
  return requestedReviewers(object).every((login) => verdicts.has(String(login).toLowerCase()));
}

/** Every login ever asked to review — active or withdrawn — broader than
 * requestedReviewers(), which only counts currently-active requests. */
function everRequestedReviewers(object) {
  return unique([
    ...(object.requestedReviewers || []).map(loginOf),
    ...(object.reviewRequests || []).map((request) => loginOf(request.reviewer || request.requestedReviewer)),
  ]);
}

/** True when this open, non-draft PR has genuinely never been put in front of anyone:
 * no active review request, no verdict from anyone on the current revision that either
 * satisfies the platform approval gate or comes from a historically-designated reviewer,
 * and no historically-designated reviewer (active or withdrawn) has a verdict on any
 * OTHER revision — that reviewer's stale verdict routes THEM a re-review obligation
 * instead (see reviewNeed), so it must not also count here. COMMENTED reviews never
 * count, from anyone: a drive-by comment from an unrequested party is not a claim on
 * the PR. A current-revision verdict from a never-requested volunteer is likewise not a
 * claim UNLESS it actually satisfies required-approval — a protected repo's aggregate
 * REVIEW_REQUIRED means GitHub itself does not recognize that volunteer's approval as
 * sufficient, so a naive "any current-revision verdict counts" reading would silently
 * leave the PR obligation-free for everyone. */
function noReviewerHasBeenAsked(object) {
  if (requestedReviewers(object).length > 0) return false;
  const currentRevision = currentRevisionOf(object);
  const currentVerdicts = verdictsOnRevision(object, currentRevision);
  const everRequested = everRequestedReviewers(object);
  if (currentVerdicts.size > 0) {
    const satisfiesApprovalGate = object.requiredApprovalSatisfied === true;
    const fromDesignatedReviewer = [...currentVerdicts.keys()].some((login) =>
      everRequested.some((requested) => sameLogin(requested, login)));
    if (satisfiesApprovalGate || fromDesignatedReviewer) return false;
  }
  const designatedHasAnyVerdict = (object.reviews || []).some((review) =>
    ['APPROVED', 'CHANGES_REQUESTED'].includes(reviewState(review)) &&
    everRequested.some((login) => sameLogin(login, loginOf(review.author || review.user))));
  return !designatedHasAnyVerdict;
}

function authorizedResolution(object) {
  if (!object.finalResolution) return null;
  const owner = loginOf(object.decisionOwner) || (object.assignees || []).map(loginOf)[0];
  const author = loginOf(object.finalResolution.author);
  return owner && sameLogin(owner, author) && object.finalResolution.outcome
    ? object.finalResolution
    : null;
}

function mergeObligation(existing, incoming) {
  if (!existing) return incoming;
  existing.reasons = unique([...existing.reasons, ...incoming.reasons]);
  if (incoming.action === 're-review-current-revision') existing.action = incoming.action;
  return existing;
}

/** Reduce normalized GitHub primitives to one actionable item per object, plus a separate
 * notices tier: awareness signals that are never presented as work owed (see digest/SKILL.md). */
export function reduceObligations(input) {
  if (input.blocked) {
    // Named fields only — never spread `input`, which may carry a collector-internal
    // `objects: []` that has no place in the declared output schema (see digest/SKILL.md).
    return {
      schemaVersion: SCHEMA_VERSION,
      source: input.source || 'fixture',
      repository: input.repository || null,
      viewer: input.viewer || null,
      blocked: input.blocked,
      blockers: [],
      obligations: [],
      notices: [],
    };
  }
  const viewer = input.viewer;
  if (!viewer) {
    return {
      schemaVersion: SCHEMA_VERSION,
      source: input.source || 'fixture',
      repository: input.repository || null,
      viewer: null,
      blocked: { code: 'viewer-unresolved', message: 'Could not resolve the authenticated GitHub viewer.' },
      blockers: [],
      obligations: [],
      notices: [],
    };
  }

  const byId = new Map();
  const blockers = [];
  const objectsWithObligations = new Set();
  const objectsWithBlockers = new Set();
  const noticesById = new Map();

  function record(item, object) {
    byId.set(item.id, mergeObligation(byId.get(item.id), item));
    objectsWithObligations.add(objectKey(object));
  }

  function recordBlocker(blocker, object) {
    blockers.push(blocker);
    objectsWithBlockers.add(objectKey(object));
  }

  // A notice is awareness, never work owed — kept in a separate array so no consumer can
  // mistake it for an obligation (see digest/SKILL.md's notices-tier contract).
  function addNotice(object, reason, extra = {}) {
    const id = `notice:${reason}:${objectKey(object)}`;
    if (noticesById.has(id)) return;
    noticesById.set(id, { id, kind: 'NOTICE', ...objectRef(object), reasons: [reason], ...extra });
  }

  for (const object of input.objects || []) {
    if (!isOpen(object)) continue; // closed objects produce neither an obligation nor a notice

    const isFyiObject = object.isFYI || hasLabel(object, 'fyi');
    if (!isFyiObject) {
      const recipient = designatedAckRecipient(object);
      if (recipient && sameLogin(recipient, viewer) && !hasEyesFrom(object, viewer)) {
        record(obligation('ACK', object, 'designated-ack-missing', 'add-eyes-reaction'), object);
      }

      if (object.type === 'issue') {
        const assigned = (object.assignees || []).map(loginOf).some((login) => sameLogin(login, viewer));
        if (assigned) {
          const isDecision = object.issueType?.toLowerCase() === 'decision' || hasLabel(object, 'decision');
          const resolution = isDecision ? authorizedResolution(object) : null;
          const item = resolution
            ? obligation('SETTLE', object, 'authorized-resolution-ready', 'settle-decision', { outcome: resolution.outcome })
            : obligation('DECIDE/ACT', object, isDecision ? 'decision-assigned' : 'issue-assigned', isDecision ? 'decide' : 'act');
          record(item, object);
        }
      }

      if (object.type === 'discussion' && object.isAnswerable === true && sameLogin(loginOf(object.author), viewer)) {
        // Q&A is native, not a fabricated obligation class: GitHub already tracks
        // isAnswerable/isAnswered, so the author owes accepting or closing the round.
        if (object.isAnswered === true) {
          record(obligation('SETTLE', object, 'answered-question-open', 'close-answered-question'), object);
        } else {
          // A comment with no resolvable author (deleted/ghost account) is not evidence of
          // a stranger — only a real, different login counts (F5).
          const strangerCommented = (object.comments || []).some((comment) => {
            const login = loginOf(comment.author);
            return login && !sameLogin(login, viewer);
          });
          if (strangerCommented) {
            record(obligation('DECIDE/ACT', object, 'question-has-unaccepted-answers', 'accept-answer-or-follow-up'), object);
          }
        }
      }

      if (object.type === 'pull_request') {
        const need = reviewNeed(object, viewer);
        if (need) {
          record(obligation('REVIEW', object, need.reasons[0], need.action, {
            reasons: need.reasons,
            currentRevision: need.currentRevision,
          }), object);
        }
        if (sameLogin(loginOf(object.author), viewer) && currentChangeRequest(object)) {
          record(obligation('DECIDE/ACT', object, 'current-revision-changes-requested', 'address-requested-changes'), object);
        }
        // Invariant: an open non-draft PR is never obligation-free. Nobody has been asked
        // yet — no active request, no verdict on the current revision, and no
        // historically-designated reviewer's stale verdict either — so requesting one is
        // the author's action, not mere awareness (see digest/SKILL.md).
        if (object.isDraft !== true && sameLogin(loginOf(object.author), viewer) && noReviewerHasBeenAsked(object)) {
          record(obligation('DECIDE/ACT', object, 'no-reviewer-requested', 'request-reviewer'), object);
        }
        const touchesCore = object.isCore === true || (object.files || []).some((file) =>
          String(typeof file === 'string' ? file : file?.path || '').startsWith('core/'));
        const mergeReady = object.mergeReady === true ||
          (String(object.mergeable).toUpperCase() === 'MERGEABLE' && String(object.mergeStateStatus).toUpperCase() === 'CLEAN');
        const conflicting = String(object.mergeable).toUpperCase() === 'CONFLICTING';
        const settlementOwner = loginOf(object.settlementOwner) || loginOf(object.author);
        const viewerOwnsSettlement = sameLogin(settlementOwner, viewer);
        // Approval-readiness itself never depends on mergeable state — a conflicting PR still
        // has an owner, it just needs a different action than a clean merge (see below).
        const approvalReady = object.viewerCanSettle === true && viewerOwnsSettlement &&
          object.requiredApprovalSatisfied === true;
        if (approvalReady && touchesCore && object.coreGateEnforced !== true) {
          recordBlocker({
            code: 'core-enforcement-unverified',
            ...objectRef(object),
            message: 'Core approval exists, but required review, stale dismissal, and admin enforcement were not verified.',
          }, object);
        } else if (approvalReady && mergeReady) {
          const item = touchesCore
            ? obligation('SETTLE', object, 'core-approved-current-revision', 'merge-core')
            : obligation('SETTLE', object, 'pull-request-approved-current-revision', 'merge-pull-request');
          record(item, object);
        } else if (approvalReady && conflicting) {
          record(obligation('SETTLE', object, 'approved-but-conflicting', 'resolve-conflicts-then-merge'), object);
        } else if (approvalReady) {
          // Approval-ready always yields exactly one obligation for its settlement owner —
          // BEHIND/BLOCKED/UNSTABLE mergeStateStatus, an UNKNOWN mergeable while GitHub still
          // computes it, or any other non-CLEAN/non-CONFLICTING state all land here rather
          // than going silent.
          record(obligation('SETTLE', object, 'approved-awaiting-mergeability', 'prepare-branch-then-merge'), object);
        } else if (viewerOwnsSettlement && object.requiredApprovalSatisfied === true && object.viewerCanSettle !== true) {
          // F2(b): the viewer owns settlement and approval is satisfied, but they lack
          // merge authority on this repository (no admin/maintain/write permission, or
          // GitHub otherwise refused the update). Per-viewer data can never reveal
          // whether some OTHER account could merge it, so this closes the author side
          // honestly with a visible blocker rather than going silent.
          recordBlocker({
            code: 'settlement-owner-cannot-merge',
            ...objectRef(object),
            message: 'You are the settlement owner and approval is satisfied, but you lack merge authority on this repository. Another account with merge authority may need to act; this cannot be detected from your own permissions alone.',
          }, object);
        }
      }
    }

    // Notices: awareness only. Never suppressed by isFyiObject — a prose ping inside an
    // Announcement is exactly the gap this tier exists to catch.
    if (mentionsOfOthers(object, viewer).some((handle) => sameLogin(handle, viewer)) &&
        !objectsWithObligations.has(objectKey(object)) &&
        !objectsWithBlockers.has(objectKey(object)) &&
        !hasFormalSignal(object, viewer)) {
      // Suppressed when the viewer already has an obligation or a blocker on this object
      // (F3) — obligation/blocker supersedes the weaker awareness signal — or when the
      // object carries a formal signal for the viewer regardless of completion state
      // (F1): a completed ACK/review/assignment must not resurface as standing notice
      // noise for exactly the person who completed it (see digest/SKILL.md).
      addNotice(object, 'mentioned-in-prose');
    }
  }

  const order = new Map(['ACK', 'DECIDE/ACT', 'REVIEW', 'SETTLE'].map((kind, index) => [kind, index]));
  const obligations = [...byId.values()].sort((a, b) =>
    (order.get(a.kind) - order.get(b.kind)) || String(a.url || a.id).localeCompare(String(b.url || b.id)));
  const notices = [...noticesById.values()].sort((a, b) => String(a.url || a.id).localeCompare(String(b.url || b.id)));
  // Self-report rather than silently drop: the comment scan is capped (see graphQlQuery),
  // so an object whose comments connection exceeded the cap may hide an undetected mention.
  // Scoped to objects still in play (F5(b)) — a closed object's undetected comments no
  // longer matter to anyone's digest.
  const commentScanTruncated = (input.objects || [])
    .filter((object) => object.commentsTruncated === true && isOpen(object))
    .map((object) => objectRef(object));
  return {
    schemaVersion: SCHEMA_VERSION,
    source: input.source || 'fixture',
    repository: input.repository || null,
    viewer,
    blocked: null,
    blockers,
    obligations,
    notices,
    ...(commentScanTruncated.length ? { commentScanTruncated } : {}),
    ...(input.caveat ? { caveat: input.caveat, authenticatedViewer: input.authenticatedViewer } : {}),
  };
}

function defaultRunGh(args) {
  const result = spawnSync('gh', args, { encoding: 'utf8' });
  if (result.error) throw new Error(result.error.code === 'ENOENT' ? 'gh executable not found' : result.error.message);
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `gh exited ${result.status}`).trim());
  return result.stdout;
}

export function graphQlQuery() {
  return `query($owner:String!,$name:String!){
    viewer{login}
    repository(owner:$owner,name:$name){
      viewerPermission
      defaultBranchRef{name branchProtectionRule{pattern requiresApprovingReviews requiredApprovingReviewCount dismissesStaleReviews isAdminEnforced}}
      discussions(first:100){
        pageInfo{hasNextPage}
        nodes{id number title body url closed isAnswered category{isAnswerable} author{login} labels(first:20){nodes{name}} reactions(first:100,content:EYES){pageInfo{hasNextPage} nodes{content user{login}}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body}}}
      }
      issues(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state author{login} issueType{name} labels(first:20){nodes{name}} assignees(first:10){nodes{login}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body createdAt}}}
      }
      pullRequests(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state isDraft author{login} headRefOid mergeable mergeStateStatus reviewDecision viewerCanUpdate labels(first:20){nodes{name}} assignees(first:10){nodes{login}} files(first:100){pageInfo{hasNextPage} nodes{path}} reviewRequests(first:50){nodes{requestedReviewer{... on User{login} ... on Team{slug}}}} reviews(last:100){nodes{author{login} state submittedAt commit{oid}}} timelineItems(first:100,itemTypes:[REVIEW_REQUESTED_EVENT]){pageInfo{hasNextPage} nodes{... on ReviewRequestedEvent{createdAt requestedReviewer{... on User{login} ... on Team{slug}}}}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body}}}
      }
    }
  }`;
}

function flattenConnection(connection) {
  return connection?.nodes || [];
}

function normalizeLive(data, repository, viewer) {
  const repo = data.data?.repository;
  if (!repo) throw new Error('repository was not returned by GitHub');
  const authenticatedViewer = data.data?.viewer?.login || null;
  const truncated = ['discussions', 'issues', 'pullRequests'].filter((key) => repo[key]?.pageInfo?.hasNextPage);
  if (flattenConnection(repo.discussions).some((discussion) => discussion.reactions?.pageInfo?.hasNextPage)) {
    truncated.push('discussion reactions');
  }
  if (flattenConnection(repo.pullRequests).some((pull) => pull.timelineItems?.pageInfo?.hasNextPage)) {
    truncated.push('pull request review history');
  }
  if (flattenConnection(repo.pullRequests).some((pull) => pull.files?.pageInfo?.hasNextPage)) {
    truncated.push('pull request files');
  }
  if (truncated.length) throw new Error(`required collection exceeds one page: ${truncated.join(', ')}`);

  const discussions = flattenConnection(repo.discussions).map((value) => ({
    ...value,
    type: 'discussion',
    // isAnswerable lives on DiscussionCategory, not Discussion itself — GitHub's schema
    // rejects a flat `isAnswerable` on the Discussion node. Derive it from the category.
    isAnswerable: value.category?.isAnswerable === true,
    labels: flattenConnection(value.labels),
    reactions: flattenConnection(value.reactions),
    comments: flattenConnection(value.comments),
    // Non-blocking: the comment scan self-reports its cap (commentScanTruncated) rather
    // than failing the whole run the way the required-collection truncations above do.
    commentsTruncated: value.comments?.pageInfo?.hasNextPage === true,
  }));
  const issues = flattenConnection(repo.issues).map((value) => {
    const comments = flattenConnection(value.comments);
    const resolutionComment = comments.findLast((comment) => /(?:^|\n)Outcome:\s*\S/i.test(comment.body || '') && /(?:^|\n)Decision:\s*\S/i.test(comment.body || ''));
    return {
      ...value,
      type: 'issue',
      issueType: value.issueType?.name || null,
      labels: flattenConnection(value.labels),
      assignees: flattenConnection(value.assignees),
      comments,
      commentsTruncated: value.comments?.pageInfo?.hasNextPage === true,
      finalResolution: resolutionComment && {
        author: resolutionComment.author,
        outcome: resolutionComment.body.match(/(?:^|\n)Outcome:\s*([^\n]+)/i)?.[1]?.trim(),
      },
    };
  });
  const pullRequests = flattenConnection(repo.pullRequests).map((value) => {
    const activeRequests = flattenConnection(value.reviewRequests).map((request) => request.requestedReviewer);
    const requestHistory = flattenConnection(value.timelineItems).map((event) => ({
      reviewer: event.requestedReviewer,
      requestedAt: event.createdAt,
      active: activeRequests.some((actor) => sameLogin(loginOf(actor), loginOf(event.requestedReviewer))),
    }));
    const protection = repo.defaultBranchRef?.branchProtectionRule;
    const coreGateEnforced = Boolean(
      protection?.requiresApprovingReviews &&
      protection?.requiredApprovingReviewCount >= 1 &&
      protection?.dismissesStaleReviews &&
      protection?.isAdminEnforced,
    );
    const prAssignees = flattenConnection(value.assignees);
    const reviews = flattenConnection(value.reviews).map((review) => ({ ...review, revision: review.commit?.oid }));
    const currentRevision = value.headRefOid;
    // GitHub returns reviewDecision null/empty whenever the base branch has no branch
    // protection rule — that must not read as "not approved". Fall back to deriving
    // readiness from the per-reviewer, per-revision verdicts (see B1).
    const aggregateDecision = String(value.reviewDecision || '').toUpperCase();
    const requiredApprovalSatisfied = aggregateDecision === 'APPROVED' || (
      !aggregateDecision && approvalReadyFromReviews({
        currentRevision,
        reviews,
        requestedReviewers: activeRequests,
        reviewRequests: requestHistory,
      })
    );
    return {
      ...value,
      type: 'pull_request',
      currentRevision,
      labels: flattenConnection(value.labels),
      assignees: prAssignees,
      // Exactly one assignee explicitly transfers the settlement/merge obligation; zero or
      // multiple assignees do not, so it falls back to the PR author (see B2).
      settlementOwner: prAssignees.length === 1 ? loginOf(prAssignees[0]) : loginOf(value.author),
      files: flattenConnection(value.files),
      requestedReviewers: activeRequests,
      reviewRequests: requestHistory,
      reviews,
      comments: flattenConnection(value.comments),
      commentsTruncated: value.comments?.pageInfo?.hasNextPage === true,
      isCore: flattenConnection(value.files).some((file) => file.path?.startsWith('core/')),
      viewerCanSettle: ['ADMIN', 'MAINTAIN', 'WRITE'].includes(repo.viewerPermission) && value.viewerCanUpdate === true,
      requiredApprovalSatisfied,
      coreGateEnforced,
      mergeReady: value.mergeable === 'MERGEABLE' && value.mergeStateStatus === 'CLEAN',
    };
  });
  const result = { schemaVersion: SCHEMA_VERSION, source: 'github', repository, viewer, objects: [...discussions, ...issues, ...pullRequests] };
  // A --for run answers with the GraphQL-authenticated account's permissions, not the
  // named viewer's — self-report rather than attempt full impersonation (see R2-3).
  if (authenticatedViewer && viewer && !sameLogin(authenticatedViewer, viewer)) {
    result.caveat = 'permissions-of-authenticated-viewer';
    result.authenticatedViewer = authenticatedViewer;
  }
  return result;
}

/** Collect live primitives, returning a machine-readable blocked result on any gap. */
export function collectGitHubPrimitives({ repository, viewer, runGh = defaultRunGh } = {}) {
  try {
    const resolvedRepository = repository || JSON.parse(runGh(['repo', 'view', '--json', 'nameWithOwner'])).nameWithOwner;
    const resolvedViewer = viewer || JSON.parse(runGh(['api', 'user'])).login;
    const [owner, name] = String(resolvedRepository || '').split('/');
    if (!owner || !name) throw new Error('repository must be OWNER/REPO');
    const raw = runGh(['api', 'graphql', '-f', `query=${graphQlQuery()}`, '-F', `owner=${owner}`, '-F', `name=${name}`]);
    return normalizeLive(JSON.parse(raw), resolvedRepository, resolvedViewer);
  } catch (error) {
    return {
      schemaVersion: SCHEMA_VERSION,
      source: 'github',
      repository: repository || null,
      viewer: viewer || null,
      blocked: { code: 'github-collection-blocked', message: error.message },
      objects: [],
    };
  }
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

export function runCli(args = process.argv.slice(2)) {
  const inputPath = option(args, '--input');
  try {
    const input = inputPath
      ? { ...JSON.parse(readFileSync(inputPath, 'utf8')), source: 'fixture' }
      : collectGitHubPrimitives({ repository: option(args, '--repo'), viewer: option(args, '--for') });
    const result = reduceObligations(input);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return result.blocked ? 2 : 0;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      source: inputPath ? 'fixture' : 'github',
      blocked: { code: 'input-unreadable', message: error.message },
      blockers: [],
      obligations: [],
    }, null, 2)}\n`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli();
}
