#!/usr/bin/env node
// relay:digest — collect GitHub primitives, then reduce them to viewer obligations.
// Collection is intentionally separate from the deterministic reducer: fixture JSON
// exercises semantics without network access, while live use shells out only to `gh`.
//
// SCHEMA_VERSION 4 (ADR-100): the reducer follows the Accord memory model
// (blueprints/plans/2026-07-22-accord-memory-model.md). Announcement receipt-default
// (ADR-097) and the close-announcement nudge retired entirely — there is no Announcement
// object any more; a passing heads-up is a plain @mention, caught only by the notices
// tier below. The LEGACY [ACK]-titled-Discussion compatibility path (pre-097
// single-recipient 👀 semantics) retired 2026-07-22 once migration completed with zero
// live legacy objects remaining — see ADR-100's Legacy-compatibility section. Issue
// obligations now derive from stage labels (needs-input / awaiting-acceptance /
// awaiting-record) rather than an issueType-based Decision path — see issueStage below.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 4;

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
 * and the handle itself must start alnum, so `@-junk` is never a valid GitHub login.
 * A handle immediately followed by `/` (e.g. `@org/team-name`) is a GitHub team/org path,
 * never a user mention — it is dropped entirely, along with the `/segment` after it, so it
 * never surfaces as a mention anywhere, including the notices tier (carried over from
 * fable B1, pre-ADR-100). A BARE `@org` mention (no trailing `/`) is not distinguishable
 * from a real user login here and is deliberately left as one — see digest/SKILL.md for
 * the honest limit that documents. */
function findAllMentions(text) {
  const regex = /(^|[^\w.@])@([A-Za-z0-9][A-Za-z0-9-]*)(\/)?/g;
  const handles = [];
  let match;
  while ((match = regex.exec(text || '')) !== null) {
    if (match[3] === '/') continue; // @org/team path — not a user mention
    handles.push(match[2].toLowerCase());
  }
  return handles;
}

/** Every @mention across an object's title, body, and comment bodies, tagged with its
 * source ('title' | 'body' | 'comment') and — for a comment — its `createdAt`, excluding
 * any mention inside text the viewer themselves authored (title/body -> object author;
 * comment -> comment author): naming yourself in your own text is not someone pinging you
 * (F4). A source with no resolvable author is never treated as self-authored, so it still
 * counts. The source/timestamp tagging is what lets the caller apply ADR-096's temporal
 * rule to comment-borne mentions while keeping title/body mentions atemporal (see
 * viewerLastCommentAt below and the notice-suppression code in reduceObligations). */
function mentionsWithSource(object, viewer) {
  const sources = [
    { text: object.title, author: object.author, source: 'title', createdAt: null },
    { text: object.body, author: object.author, source: 'body', createdAt: null },
    ...(object.comments || []).map((comment) => ({
      text: comment.body,
      author: comment.author,
      source: 'comment',
      // A comment missing createdAt (legacy/fixture data with no timestamp field) sorts
      // as "older than everything" via the empty string — see viewerLastCommentAt's
      // string-compare below, which then treats it as covered by any prior viewer
      // comment regardless of that comment's own timestamp, so legacy fixtures without
      // createdAt stay meaningful instead of silently never-suppressing.
      createdAt: comment.createdAt || '',
    })),
  ];
  const mentions = [];
  for (const source of sources) {
    if (sameLogin(loginOf(source.author), viewer)) continue;
    for (const handle of findAllMentions(source.text)) {
      mentions.push({ handle, source: source.source, createdAt: source.createdAt });
    }
  }
  return mentions;
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

/** True when this object already carries a FORMAL signal for the viewer — requested
 * reviewer (active or withdrawn history), or assignee — regardless of whether that round
 * is already complete. A completed round (verdict given) must not resurface as a standing
 * mentioned-in-prose notice forever (F1): the object still names the viewer, so the
 * mention scan would otherwise keep firing after the work is done, exactly the noise
 * ADR-090 retired the old startup-digest hook to avoid. */
function hasFormalSignal(object, viewer) {
  if (wasDesignatedReviewer(object, viewer)) return true;
  if ((object.assignees || []).map(loginOf).some((login) => sameLogin(login, viewer))) return true;
  return false;
}

/** True when the viewer has EVER engaged with this object at all — commented (any time),
 * or (Discussions only) left an 👀 reaction. This is the ATEMPORAL signal ADR-096 uses to
 * suppress a title/body mention: a body/title mention has no per-mention timestamp (an
 * edit doesn't record which mention was added when), so "the viewer has looked at this
 * object at some point" is the only signal available, and that is enough — repeating a
 * body/title mention forever just because the object still names the viewer is exactly
 * the noise ADR-090 retired the old startup-digest hook to avoid. This does NOT cover a
 * COMMENT-borne mention — see viewerLastCommentAt below, which applies the temporal rule
 * ADR-096 v2 requires there (a later "@person please respond" comment must still fire even
 * in a thread the viewer once touched). Deliberate asymmetry: Issues and PRs carry no
 * reaction query today, so only comment-engagement applies to those two types. */
function viewerEngaged(object, viewer) {
  const commented = (object.comments || []).some((comment) => sameLogin(loginOf(comment.author), viewer));
  if (commented) return true;
  return object.type === 'discussion' && hasEyesFrom(object, viewer);
}

/** The latest `createdAt` among the viewer's OWN comments on this object, or `null` when
 * the viewer has never commented. This is the TEMPORAL signal ADR-096 v2 requires for a
 * comment-borne mention: a comment mention is suppressed only when it is at-or-before this
 * timestamp — one that arrives AFTER the viewer's last comment still fires, because the
 * viewer has not seen it yet. An 👀 reaction carries no timestamp in the collected data,
 * so it deliberately does NOT feed this function; 👀 only ever suppresses a title/body
 * mention via viewerEngaged above, never a comment-borne one. String-compared as ISO8601,
 * the same way the reducer already compares review/revision timestamps elsewhere. */
function viewerLastCommentAt(object, viewer) {
  const stamps = (object.comments || [])
    .filter((comment) => sameLogin(loginOf(comment.author), viewer))
    .map((comment) => comment.createdAt || '');
  return stamps.length ? stamps.reduce((max, value) => (value > max ? value : max)) : null;
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

/** An OPEN Issue's obligation action is derived from its stage labels (Accord memory
 * model, blueprint section 8/10 — ADR-100). Exactly one obligation per Issue per viewer:
 * labels are STAGES, not stacking claims. `awaiting-record` is the native promotion
 * signal `settle` leaves for the recorder (blueprint section 10) — the digest computes
 * "the recorder owes the Decision commit" from this label plus the (reassigned) assignee
 * alone, no prose parsing. No stage label present is the unchanged default: plain
 * assignment obligates `act`. */
const ISSUE_STAGES = [
  { label: 'needs-input', kind: 'DECIDE/ACT', action: 'provide-requested-input' },
  { label: 'awaiting-acceptance', kind: 'DECIDE/ACT', action: 'accept-or-dispose' },
  { label: 'awaiting-record', kind: 'SETTLE', action: 'record-decision' },
];

/** Resolve one Issue's stage. Multiple stage labels present at once is malformed — stage
 * labels are meant to be mutually exclusive (an Issue is in exactly one stage), so this
 * picks the LATEST stage in the canonical order (needs-input < awaiting-acceptance <
 * awaiting-record) for a deterministic obligation, and flags the object with
 * `malformed: ['conflicting-stage-labels']` rather than silently choosing with no signal —
 * a conformance-tier concern, not something the digest hides. */
function issueStage(object) {
  const present = ISSUE_STAGES.filter((stage) => hasLabel(object, stage.label));
  if (present.length === 0) return { kind: 'DECIDE/ACT', reason: 'issue-assigned', action: 'act', malformed: null };
  if (present.length === 1) {
    const stage = present[0];
    return { kind: stage.kind, reason: stage.label, action: stage.action, malformed: null };
  }
  const latest = present.reduce((a, b) => (ISSUE_STAGES.indexOf(b) > ISSUE_STAGES.indexOf(a) ? b : a));
  return { kind: latest.kind, reason: latest.label, action: latest.action, malformed: ['conflicting-stage-labels'] };
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
      if (object.type === 'issue') {
        const assigned = (object.assignees || []).map(loginOf).some((login) => sameLogin(login, viewer));
        if (assigned) {
          const stage = issueStage(object);
          const extra = stage.malformed ? { malformed: stage.malformed } : {};
          record(obligation(stage.kind, object, stage.reason, stage.action, extra), object);
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

    // Notices: awareness only (ADR-100). Under the Accord memory model this is the ONLY
    // path a plain @mention takes — there is no Announcement/receipt-default obligation
    // any more (blueprint section 1: "a passing heads-up is an @mention on the relevant
    // object"). Never suppressed by isFyiObject — a prose ping on an fyi-labeled object is
    // exactly the gap this tier exists to catch.
    const viewerMentions = mentionsWithSource(object, viewer).filter((mention) => sameLogin(mention.handle, viewer));
    if (viewerMentions.length &&
        !objectsWithObligations.has(objectKey(object)) &&
        !objectsWithBlockers.has(objectKey(object))) {
      // Suppressed outright when the viewer already has an OPEN obligation or a blocker on
      // this object (F3) — an obligation/blocker supersedes the weaker awareness signal,
      // and this stays a blanket gate covering every mention source: nobody needs a second
      // nag on an object they already owe work on (fable I2 interaction check).
      //
      // Below this gate, formal-signal suppression (F1) and the temporal comment rule
      // (ADR-096 v2) apply to DIFFERENT sources — this split is deliberate (fable I2):
      //   - title/body: no per-mention timestamp exists (an edit doesn't record which
      //     mention was added when), so EITHER prior engagement (a comment, or on a
      //     Discussion an 👀 — viewerEngaged()) OR a formal signal regardless of
      //     completion state (hasFormalSignal() — requested reviewer active-or-history, or
      //     assignee) suppresses it for good. A completed review/assignment must not
      //     resurface as standing notice noise for exactly the person who completed it.
      //   - comment: DOES carry a timestamp, so it is governed SOLELY by the temporal
      //     rule — suppressed only when the viewer's own last comment is at-or-after it —
      //     regardless of any formal signal. A named reviewer who already gave their
      //     verdict is not deaf to a LATER "@them please respond" comment: formal-signal
      //     history answers "did you ever have a reason to look," not "have you seen
      //     everything anyone will ever say here." Letting formal-signal history gate a
      //     comment mention was exactly the bug this fixes — it silently resurrected the
      //     founding ADR-093 failure (a later ping going unseen) for anyone who happened to
      //     also hold a formal signal on the object.
      const engagedAtAll = viewerEngaged(object, viewer);
      const formalSignal = hasFormalSignal(object, viewer);
      const lastCommentAt = viewerLastCommentAt(object, viewer);
      const titleOrBodyFires = viewerMentions.some((mention) => mention.source !== 'comment') &&
        !engagedAtAll && !formalSignal;
      const commentFires = viewerMentions.some((mention) => mention.source === 'comment' &&
        (lastCommentAt === null || mention.createdAt > lastCommentAt));
      if (titleOrBodyFires || commentFires) {
        // A mention notice exists to surface something the viewer hasn't seen; once
        // they've visibly interacted with the thread AT OR AFTER a given mention, it is
        // stale noise — but a later mention is new information again (see digest/SKILL.md).
        addNotice(object, 'mentioned-in-prose');
      }
    }
  }

  const order = new Map(['DECIDE/ACT', 'REVIEW', 'SETTLE'].map((kind, index) => [kind, index]));
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
        nodes{id number title body url closed isAnswered category{isAnswerable} author{login} labels(first:20){nodes{name}} reactions(first:100,content:EYES){pageInfo{hasNextPage} nodes{content user{login}}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body createdAt}}}
      }
      issues(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state author{login} labels(first:20){nodes{name}} assignees(first:10){nodes{login}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body createdAt}}}
      }
      pullRequests(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state isDraft author{login} headRefOid mergeable mergeStateStatus reviewDecision viewerCanUpdate labels(first:20){nodes{name}} assignees(first:10){nodes{login}} files(first:100){pageInfo{hasNextPage} nodes{path}} reviewRequests(first:50){nodes{requestedReviewer{... on User{login} ... on Team{slug}}}} reviews(last:100){nodes{author{login} state submittedAt commit{oid}}} timelineItems(first:100,itemTypes:[REVIEW_REQUESTED_EVENT]){pageInfo{hasNextPage} nodes{... on ReviewRequestedEvent{createdAt requestedReviewer{... on User{login} ... on Team{slug}}}}} comments(last:50){pageInfo{hasNextPage} nodes{author{login} body createdAt}}}
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
    return {
      ...value,
      type: 'issue',
      // Obligation action derives from stage labels (issueStage, ADR-100) — a
      // Resolution:/Outcome: comment is tier-2 record semantics for humans and the
      // conformance sweep (blueprint section 8), never a signal the digest reducer parses.
      labels: flattenConnection(value.labels),
      assignees: flattenConnection(value.assignees),
      comments,
      commentsTruncated: value.comments?.pageInfo?.hasNextPage === true,
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
