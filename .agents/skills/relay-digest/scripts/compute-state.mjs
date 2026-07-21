#!/usr/bin/env node
// relay:digest — collect GitHub primitives, then reduce them to viewer obligations.
// Collection is intentionally separate from the deterministic reducer: fixture JSON
// exercises semantics without network access, while live use shells out only to `gh`.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 2;

const loginOf = (actor) => typeof actor === 'string' ? actor : actor?.login || actor?.slug || null;
const sameLogin = (left, right) => Boolean(left && right && left.toLowerCase() === right.toLowerCase());
const unique = (values) => [...new Set(values.filter(Boolean))];
const hasLabel = (object, label) => (object.labels || []).some((value) =>
  (typeof value === 'string' ? value : value?.name)?.toLowerCase() === label.toLowerCase());
const isOpen = (object) => object.closed !== true && (!object.state || object.state.toUpperCase() === 'OPEN');

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
    id: `${kind.toLowerCase()}:${object.id || object.url || object.number}`,
    kind,
    ...objectRef(object),
    reasons: [reason],
    action,
    ...extra,
  };
}

function firstMention(text) {
  // The @ must not be preceded by a word character or a dot, so `hello@rytho.ai` never
  // reads as a mention of `rytho`. Group 2 is the handle.
  const match = /(^|[^\w.@])@([A-Za-z0-9][A-Za-z0-9-]*)/.exec(text || '');
  return match ? match[2].toLowerCase() : null;
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

function reviewNeed(object, viewer) {
  const reviews = (object.reviews || [])
    .filter((review) => sameLogin(loginOf(review.author || review.user), viewer))
    .sort((a, b) => String(a.submittedAt || '').localeCompare(String(b.submittedAt || '')));
  const currentRevision = object.currentRevision || object.headSha || object.headRefOid || null;
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
  const currentRevision = object.currentRevision || object.headSha || object.headRefOid || null;
  return [...verdictsOnRevision(object, currentRevision).values()].includes('CHANGES_REQUESTED');
}

/** Approval readiness derived from per-reviewer, per-revision verdicts — used when the
 * aggregate reviewDecision is null/empty, which GitHub returns whenever the base branch
 * has no branch-protection rule (e.g. private free-plan repos). */
function approvalReadyFromReviews(object) {
  const currentRevision = object.currentRevision || object.headSha || object.headRefOid || null;
  const verdicts = verdictsOnRevision(object, currentRevision);
  const states = [...verdicts.values()];
  if (!states.includes('APPROVED')) return false;
  if (states.includes('CHANGES_REQUESTED')) return false;
  return requestedReviewers(object).every((login) => verdicts.has(String(login).toLowerCase()));
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

/** Reduce normalized GitHub primitives to one actionable item per object. */
export function reduceObligations(input) {
  if (input.blocked) return { ...input, schemaVersion: SCHEMA_VERSION, blockers: [], obligations: [] };
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
    };
  }

  const byId = new Map();
  const blockers = [];
  for (const object of input.objects || []) {
    if (!isOpen(object) || object.isFYI || hasLabel(object, 'fyi')) continue;

    const recipient = designatedAckRecipient(object);
    if (recipient && sameLogin(recipient, viewer) && !hasEyesFrom(object, viewer)) {
      const item = obligation('ACK', object, 'designated-ack-missing', 'add-eyes-reaction');
      byId.set(item.id, mergeObligation(byId.get(item.id), item));
    }

    if (object.type === 'issue') {
      const assigned = (object.assignees || []).map(loginOf).some((login) => sameLogin(login, viewer));
      if (!assigned) continue;
      const isDecision = object.issueType?.toLowerCase() === 'decision' || hasLabel(object, 'decision');
      const resolution = isDecision ? authorizedResolution(object) : null;
      const item = resolution
        ? obligation('SETTLE', object, 'authorized-resolution-ready', 'settle-decision', { outcome: resolution.outcome })
        : obligation('DECIDE/ACT', object, isDecision ? 'decision-assigned' : 'issue-assigned', isDecision ? 'decide' : 'act');
      byId.set(item.id, mergeObligation(byId.get(item.id), item));
    }

    if (object.type === 'pull_request') {
      const need = reviewNeed(object, viewer);
      if (need) {
        const item = obligation('REVIEW', object, need.reasons[0], need.action, {
          reasons: need.reasons,
          currentRevision: need.currentRevision,
        });
        byId.set(item.id, mergeObligation(byId.get(item.id), item));
      }
      if (sameLogin(loginOf(object.author), viewer) && currentChangeRequest(object)) {
        const item = obligation('DECIDE/ACT', object, 'current-revision-changes-requested', 'address-requested-changes');
        byId.set(item.id, mergeObligation(byId.get(item.id), item));
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
        blockers.push({
          code: 'core-enforcement-unverified',
          ...objectRef(object),
          message: 'Core approval exists, but required review, stale dismissal, and admin enforcement were not verified.',
        });
      } else if (approvalReady && mergeReady) {
        const item = touchesCore
          ? obligation('SETTLE', object, 'core-approved-current-revision', 'merge-core')
          : obligation('SETTLE', object, 'pull-request-approved-current-revision', 'merge-pull-request');
        byId.set(item.id, mergeObligation(byId.get(item.id), item));
      } else if (approvalReady && conflicting) {
        const item = obligation('SETTLE', object, 'approved-but-conflicting', 'resolve-conflicts-then-merge');
        byId.set(item.id, mergeObligation(byId.get(item.id), item));
      } else if (approvalReady) {
        // Approval-ready always yields exactly one obligation for its settlement owner —
        // BEHIND/BLOCKED/UNSTABLE mergeStateStatus, an UNKNOWN mergeable while GitHub still
        // computes it, or any other non-CLEAN/non-CONFLICTING state all land here rather
        // than going silent.
        const item = obligation('SETTLE', object, 'approved-awaiting-mergeability', 'prepare-branch-then-merge');
        byId.set(item.id, mergeObligation(byId.get(item.id), item));
      }
    }
  }

  const order = new Map(['ACK', 'DECIDE/ACT', 'REVIEW', 'SETTLE'].map((kind, index) => [kind, index]));
  const obligations = [...byId.values()].sort((a, b) =>
    (order.get(a.kind) - order.get(b.kind)) || String(a.url || a.id).localeCompare(String(b.url || b.id)));
  return {
    schemaVersion: SCHEMA_VERSION,
    source: input.source || 'fixture',
    repository: input.repository || null,
    viewer,
    blocked: null,
    blockers,
    obligations,
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
        nodes{id number title body url closed isAnswered labels(first:20){nodes{name}} reactions(first:100,content:EYES){pageInfo{hasNextPage} nodes{content user{login}}}}
      }
      issues(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state issueType{name} labels(first:20){nodes{name}} assignees(first:10){nodes{login}} comments(last:50){nodes{author{login} body createdAt}}}
      }
      pullRequests(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state author{login} headRefOid mergeable mergeStateStatus reviewDecision viewerCanUpdate labels(first:20){nodes{name}} assignees(first:10){nodes{login}} files(first:100){pageInfo{hasNextPage} nodes{path}} reviewRequests(first:50){nodes{requestedReviewer{... on User{login} ... on Team{slug}}}} reviews(last:100){nodes{author{login} state submittedAt commit{oid}}} timelineItems(first:100,itemTypes:[REVIEW_REQUESTED_EVENT]){pageInfo{hasNextPage} nodes{... on ReviewRequestedEvent{createdAt requestedReviewer{... on User{login} ... on Team{slug}}}}}}
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
    labels: flattenConnection(value.labels),
    reactions: flattenConnection(value.reactions),
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
