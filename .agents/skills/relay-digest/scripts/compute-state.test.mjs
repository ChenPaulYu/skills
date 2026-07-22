import test from 'node:test';
import assert from 'node:assert/strict';

import { collectGitHubPrimitives, graphQlQuery, reduceObligations } from './compute-state.mjs';

const viewer = 'reviewer-one';
const base = (objects) => ({ source: 'fixture', repository: 'example/project', viewer, objects });
const item = (id, type, extra = {}) => ({
  id,
  type,
  number: Number(id.replace(/\D/g, '')) || 1,
  title: `Fixture ${id}`,
  url: `https://github.com/example/project/${type === 'pull_request' ? 'pull' : type === 'issue' ? 'issues' : 'discussions'}/${id.replace(/\D/g, '') || 1}`,
  state: 'OPEN',
  ...extra,
});

test('live GraphQL query closes every selection set', () => {
  let depth = 0;
  for (const token of graphQlQuery()) {
    if (token === '{') depth += 1;
    if (token === '}') depth -= 1;
    assert.ok(depth >= 0, 'a selection set closed before it opened');
  }
  assert.equal(depth, 0);
});

test('designated ACK remains until that account adds eyes', () => {
  const pending = item('D1', 'discussion', { title: '[ACK] Read this', body: '@reviewer-one read this; only @reviewer-one completes it', reactions: [] });
  assert.deepEqual(reduceObligations(base([pending])).obligations.map((entry) => entry.kind), ['ACK']);

  pending.reactions.push({ content: 'EYES', user: { login: viewer } });
  assert.equal(reduceObligations(base([pending])).obligations.length, 0);
});

test('a closed Discussion no longer creates an ACK obligation', () => {
  const closed = item('D21', 'discussion', {
    title: '[ACK] Superseded notice',
    body: '@reviewer-one acknowledge',
    closed: true,
    reactions: [],
  });
  assert.equal(reduceObligations(base([closed])).obligations.length, 0);
});

test('awareness ACK, exact review, and assigned evidenced work remain separate obligations', () => {
  const acknowledgment = item('D14', 'discussion', {
    title: '[ACK] Read the new rules',
    body: '@reviewer-one attest after reading; only @reviewer-one completes it',
    reactions: [],
  });
  const updateTask = item('I15', 'issue', {
    title: 'Install and verify the new tools',
    assignees: [{ login: viewer }],
  });
  const exactReview = item('P16', 'pull_request', {
    title: 'Review the exact new rules',
    currentRevision: 'rev-a',
    requestedReviewers: [viewer],
  });

  assert.deepEqual(
    reduceObligations(base([acknowledgment, updateTask, exactReview])).obligations.map((entry) => entry.kind),
    ['ACK', 'DECIDE/ACT', 'REVIEW'],
  );

  acknowledgment.reactions.push({ content: 'EYES', user: { login: viewer } });
  const remaining = reduceObligations(base([acknowledgment, updateTask, exactReview])).obligations;
  assert.deepEqual(remaining.map((entry) => entry.kind), ['DECIDE/ACT', 'REVIEW']);
  assert.equal(remaining[0].url, updateTask.url);
});

test('assignment belongs only to the assigned viewer', () => {
  const assigned = item('I2', 'issue', { assignees: [{ login: viewer }] });
  const other = item('I3', 'issue', { assignees: [{ login: 'someone-else' }] });
  assert.deepEqual(reduceObligations(base([assigned, other])).obligations.map((entry) => entry.url), [assigned.url]);
});

test('Comment does not complete a requested review verdict', () => {
  const pull = item('P4', 'pull_request', {
    currentRevision: 'rev-b',
    reviewRequests: [{ reviewer: viewer, revision: 'rev-b', active: false }],
    reviews: [{ author: viewer, state: 'COMMENTED', revision: 'rev-b' }],
  });
  const [result] = reduceObligations(base([pull])).obligations;
  assert.equal(result.kind, 'REVIEW');
  assert.ok(result.reasons.includes('comment-is-not-verdict'));
});

test('stale verdict requires re-review while a current verdict completes the round', () => {
  const pull = item('P5', 'pull_request', {
    currentRevision: 'rev-b',
    reviewRequests: [{ reviewer: viewer, revision: 'rev-a', active: false }],
    reviews: [{ author: viewer, state: 'APPROVED', revision: 'rev-a' }],
  });
  const [stale] = reduceObligations(base([pull])).obligations;
  assert.equal(stale.action, 're-review-current-revision');
  assert.ok(stale.reasons.includes('stale-verdict'));

  pull.reviews.push({ author: viewer, state: 'CHANGES_REQUESTED', revision: 'rev-b' });
  assert.equal(reduceObligations(base([pull])).obligations.length, 0);
});

test('Request changes hands the round to the PR author until a new revision is pushed', () => {
  const pull = item('P18', 'pull_request', {
    author: { login: viewer },
    currentRevision: 'rev-a',
    // reviewer-two is a designated reviewer (B2): their Request changes is a claim on the
    // PR, so once it goes stale it routes THEM a re-review obligation rather than leaving
    // the author's no-reviewer-requested guard to fire.
    reviewRequests: [{ reviewer: 'reviewer-two', revision: 'rev-a', active: true }],
    reviews: [{ author: { login: 'reviewer-two' }, state: 'CHANGES_REQUESTED', revision: 'rev-a' }],
  });
  const [authorAction] = reduceObligations(base([pull])).obligations;
  assert.equal(authorAction.kind, 'DECIDE/ACT');
  assert.equal(authorAction.action, 'address-requested-changes');

  pull.currentRevision = 'rev-b';
  assert.equal(reduceObligations(base([pull])).obligations.length, 0);

  const reviewerView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-two', objects: [pull] });
  const review = reviewerView.obligations.find((entry) => entry.kind === 'REVIEW');
  assert.ok(review, 'expected reviewer-two to owe a re-review once their verdict went stale');
  assert.ok(review.reasons.includes('stale-verdict'));
});

test('a later approval on the same revision clears the author change request', () => {
  const pull = item('P19', 'pull_request', {
    author: { login: viewer },
    currentRevision: 'rev-a',
    // reviewer-two's final verdict is a real, gate-satisfying APPROVED (matches what
    // normalizeLive's approvalReadyFromReviews fallback would compute here, since
    // there are zero outstanding requests to check against) — not an undesignated
    // drive-by that the fable-follow-up-1 fix now correctly treats as no claim.
    requiredApprovalSatisfied: true,
    reviews: [
      { author: { login: 'reviewer-two' }, state: 'CHANGES_REQUESTED', revision: 'rev-a', submittedAt: '2026-07-21T01:00:00Z' },
      { author: { login: 'reviewer-two' }, state: 'APPROVED', revision: 'rev-a', submittedAt: '2026-07-21T02:00:00Z' },
    ],
  });
  assert.equal(reduceObligations(base([pull])).obligations.length, 0);
});

test('authorized Decision Issue resolution advances assignment to settlement', () => {
  const decision = item('I6', 'issue', {
    issueType: 'Decision',
    assignees: [{ login: viewer }],
    finalResolution: { author: { login: viewer }, outcome: 'accepted' },
  });
  const [result] = reduceObligations(base([decision])).obligations;
  assert.equal(result.kind, 'SETTLE');
  assert.equal(result.action, 'settle-decision');
});

test('duplicate review signals collapse to one obligation', () => {
  const pull = item('P7', 'pull_request', {
    currentRevision: 'rev-b',
    requestedReviewers: [viewer, viewer],
    reviewRequests: [
      { reviewer: viewer, revision: 'rev-b', active: true },
      { reviewer: viewer, revision: 'rev-a', active: false },
    ],
    reviews: [{ author: viewer, state: 'APPROVED', revision: 'rev-a' }],
  });
  const result = reduceObligations(base([pull])).obligations;
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].reasons.sort(), ['review-requested', 'stale-verdict']);
});

test('ordinary approved pull request becomes a settlement obligation for its author', () => {
  const ordinary = item('P9', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const [result] = reduceObligations(base([ordinary])).obligations;
  assert.equal(result.kind, 'SETTLE');
  assert.equal(result.action, 'merge-pull-request');
});

test('a single PR assignee becomes its named settlement owner', () => {
  const ordinary = item('P20', 'pull_request', {
    author: { login: 'pr-author' },
    settlementOwner: viewer,
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeReady: true,
  });
  assert.equal(reduceObligations(base([ordinary])).obligations[0].action, 'merge-pull-request');
});

test('Core settlement excludes unauthorized viewers and unsatisfied approval gates', () => {
  const unauthorized = item('P8', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: false,
    requiredApprovalSatisfied: true,
    coreGateEnforced: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const approvalMissing = item('P10', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: false,
    coreGateEnforced: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  assert.equal(reduceObligations(base([unauthorized, approvalMissing])).obligations.length, 0);
});

test('otherwise-ready Core stays blocked when enforcement is unverified', () => {
  const policyOnly = item('P17', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    coreGateEnforced: false,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const result = reduceObligations(base([policyOnly]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.blockers[0].code, 'core-enforcement-unverified');
});

test('Core settlement appears only for an authorized viewer with satisfied current gates', () => {
  const ready = item('P11', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    coreGateEnforced: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const [result] = reduceObligations(base([ready])).obligations;
  assert.equal(result.kind, 'SETTLE');
  assert.equal(result.action, 'merge-core');
});

// Superseded by ADR-097 (receipt-default): a plain body @mention on a non-fyi,
// non-answerable Discussion used to be "mention-only, no obligation" — it now IS the
// Announcements-tier receipt trigger by design, so `mention` now owes an ACK. `fyi`
// stays the explicit broadcast opt-out and remains obligation-free.
test('ADR-097: a plain body mention on a non-fyi Discussion now owes a receipt (ACK) obligation by default; fyi-labeled traffic stays obligation-free and produces only a notice', () => {
  const mention = item('D12', 'discussion', { body: '@reviewer-one can you look?', reactions: [] });
  const fyi = item('D13', 'discussion', { title: '[FYI] Status', body: '@reviewer-one', isFYI: true });
  const result = reduceObligations(base([mention, fyi]));
  assert.deepEqual(result.obligations.map((entry) => entry.kind), ['ACK']);
  assert.equal(result.obligations[0].url, mention.url);
  assert.equal(result.obligations[0].action, 'add-eyes-reaction');
  // fyi is the explicit broadcast opt-out (ADR-097): its own mention stays a bare notice —
  // it never competes with mention's obligation above, one entry per object.
  assert.equal(result.notices.length, 1);
  assert.equal(result.notices[0].url, fyi.url);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

test('ADR-097: a multi-recipient announcement gives each named account its OWN ACK obligation, clearing individually — one recipient\'s 👀 does not clear the other\'s', () => {
  const announcement = item('D70', 'discussion', {
    title: '[ACK] Policy update',
    body: '@reviewer-one and @reviewer-two please both read this',
    reactions: [],
  });
  const oneView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-one', objects: [announcement] });
  assert.deepEqual(oneView.obligations.map((entry) => entry.kind), ['ACK']);
  const twoView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-two', objects: [announcement] });
  assert.deepEqual(twoView.obligations.map((entry) => entry.kind), ['ACK']);

  // reviewer-one alone reacts.
  announcement.reactions.push({ content: 'EYES', user: { login: 'reviewer-one' } });
  const oneAfter = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-one', objects: [announcement] });
  assert.equal(oneAfter.obligations.length, 0, 'reviewer-one\'s own 👀 clears their own receipt');
  const twoAfter = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-two', objects: [announcement] });
  assert.deepEqual(twoAfter.obligations.map((entry) => entry.kind), ['ACK'], 'reviewer-two\'s receipt is untouched by reviewer-one\'s reaction');
});

test('ADR-097: once every named recipient has left their own 👀, the announcement\'s author owes a close-announcement SETTLE — symmetric with Q&A\'s answered -> close', () => {
  const announcement = item('D71', 'discussion', {
    title: '[ACK] Policy update',
    body: '@reviewer-two and @reviewer-three please both read this',
    author: { login: 'reviewer-one' },
    reactions: [{ content: 'EYES', user: { login: 'reviewer-two' } }],
  });
  // Only one of the two recipients has reacted so far — no close-nudge yet.
  const partial = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-one', objects: [announcement] });
  assert.equal(partial.obligations.length, 0);

  announcement.reactions.push({ content: 'EYES', user: { login: 'reviewer-three' } });
  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-one', objects: [announcement] });
  const [settle] = authorView.obligations;
  assert.equal(settle.kind, 'SETTLE');
  assert.equal(settle.action, 'close-announcement');
  assert.ok(settle.reasons.includes('receipts-collected'));

  // Neither recipient owes anything further once they've each reacted.
  const recipientView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-two', objects: [announcement] });
  assert.equal(recipientView.obligations.length, 0);
});

// Comment-borne mentions never feed announcementRecipients — a receipt obligation is
// scoped to the announcement's own title/body, not to wild conversation under it. This
// is the ADR-097 instance of the wild-traffic/notice-tier distinction already exercised
// above for other reasons (e.g. 'a mention in a comment produces a notice and no
// obligation'), named here explicitly for the receipt-default feature.
test('ADR-097: a mention that appears only in a COMMENT never creates a receipt obligation — it stays wild traffic on the notice tier', () => {
  const threadWithCommentMention = item('D72', 'discussion', {
    body: 'no mention in the body itself',
    comments: [{ author: { login: 'someone-else' }, body: '@reviewer-one what do you think?', createdAt: '2026-07-22T00:00:00Z' }],
  });
  const result = reduceObligations(base([threadWithCommentMention]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

// Fable full-unit review, B1 (Blocking): announcementRecipients over-collected two kinds
// of non-recipients. (a) The object's own author, self-mentioned in their own text ("ping
// @me"), must not owe a receipt on their own post and must not block the close-nudge on
// their own reaction. (b) A GitHub team/org path (@org/team-name) is not a user mention at
// all — a team can't react 👀, so counting one as a recipient would deadlock
// receipts-collected forever. A bare @org mention (no trailing /) is indistinguishable
// from a real user login and is deliberately left as a recipient; digest/SKILL.md and
// report/SKILL.md now document that a nonexistent/typo/unreactable handle silently blocks
// the close-nudge, with no self-report — an accepted, honestly-stated limit.

test('B1(a): the author\'s own self-mention in an announcement creates no receipt for the author and never blocks the close-nudge — only OTHER named recipients govern it', () => {
  const announcement = item('D80', 'discussion', {
    title: '[ACK] Status update',
    author: { login: 'me' },
    body: 'questions? ping @me. Also cc @reviewer-two.',
    reactions: [],
  });
  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'me', objects: [announcement] });
  assert.equal(authorView.obligations.length, 0, 'the author owes no receipt on their own self-mention');

  const otherView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'reviewer-two', objects: [announcement] });
  assert.deepEqual(otherView.obligations.map((entry) => entry.kind), ['ACK']);

  // Only reviewer-two — the one real recipient — reacts. The author's own lack of a
  // reaction must not block the close-nudge, since the author was never a recipient.
  announcement.reactions.push({ content: 'EYES', user: { login: 'reviewer-two' } });
  const closeNudge = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'me', objects: [announcement] });
  const [settle] = closeNudge.obligations;
  assert.equal(settle.kind, 'SETTLE');
  assert.equal(settle.action, 'close-announcement');
});

test('B1(a): an announcement mentioning only its own author has ZERO recipients — no receipts, no close-nudge, exactly like naming nobody', () => {
  const announcement = item('D81', 'discussion', {
    title: '[ACK] Note to self',
    author: { login: 'me' },
    body: 'reminder for @me',
    reactions: [],
  });
  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'me', objects: [announcement] });
  assert.equal(authorView.obligations.length, 0);
  assert.equal(authorView.notices.length, 0);
});

test('B1(b): a team/org path mention (@org/reviewers) is neither a receipt recipient nor a close-nudge blocker — the other named human still collects normally', () => {
  const announcement = item('D82', 'discussion', {
    title: '[ACK] Deploy notice',
    author: { login: 'author-one' },
    body: 'cc @org/reviewers and @alice for awareness',
    reactions: [],
  });
  const orgView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'org', objects: [announcement] });
  assert.equal(orgView.obligations.length, 0, '@org/reviewers must never resolve to a recipient named "org"');

  const aliceView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'alice', objects: [announcement] });
  assert.deepEqual(aliceView.obligations.map((entry) => entry.kind), ['ACK']);

  announcement.reactions.push({ content: 'EYES', user: { login: 'alice' } });
  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'author-one', objects: [announcement] });
  const [settle] = authorView.obligations;
  assert.equal(settle.kind, 'SETTLE');
  assert.equal(settle.action, 'close-announcement', 'the team path must never block the close-nudge — alice alone is the only real recipient');
});

test('B1(b): a BARE @org mention (no trailing /) is indistinguishable from a real user login and is deliberately left as a recipient — a documented limit, not a bug', () => {
  const announcement = item('D83', 'discussion', {
    title: '[ACK] Heads up',
    author: { login: 'author-one' },
    body: 'cc @org for visibility',
    reactions: [],
  });
  const orgView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'org', objects: [announcement] });
  assert.deepEqual(orgView.obligations.map((entry) => entry.kind), ['ACK']);
});

test('blocked gh authentication is machine-readable and never guesses obligations', () => {
  const collected = collectGitHubPrimitives({
    repository: 'example/project',
    runGh: () => { throw new Error('authentication required'); },
  });
  const result = reduceObligations(collected);
  assert.equal(result.blocked.code, 'github-collection-blocked');
  assert.match(result.blocked.message, /authentication required/);
  assert.deepEqual(result.obligations, []);
});

test('blocked output matches the declared schema exactly — no leaked collector-internal fields', () => {
  const collected = collectGitHubPrimitives({
    repository: 'example/project',
    runGh: () => { throw new Error('authentication required'); },
  });
  const result = reduceObligations(collected);
  assert.deepEqual(Object.keys(result).sort(), [
    'blocked', 'blockers', 'notices', 'obligations', 'repository', 'schemaVersion', 'source', 'viewer',
  ].sort());
  assert.equal('objects' in result, false);
});

// --- normalizeLive coverage -------------------------------------------------
// These fixtures mirror the shape of graphQlQuery()'s actual response (field names,
// connection wrapping) and go through collectGitHubPrimitives -> normalizeLive ->
// reduceObligations, the path the 18 tests above bypass by driving reduceObligations
// directly with pre-normalized fixture flags.

function pullFixture(pullOverrides = {}, repoOverrides = {}) {
  return {
    data: {
      repository: {
        viewerPermission: 'WRITE',
        defaultBranchRef: { name: 'main', branchProtectionRule: null },
        discussions: { pageInfo: { hasNextPage: false }, nodes: [] },
        issues: { pageInfo: { hasNextPage: false }, nodes: [] },
        pullRequests: {
          pageInfo: { hasNextPage: false },
          nodes: [{
            id: 'PR_1',
            number: 21,
            title: 'Add feature',
            body: '',
            url: 'https://github.com/example/project/pull/21',
            state: 'OPEN',
            author: { login: 'author-one' },
            headRefOid: 'sha-2',
            mergeable: 'MERGEABLE',
            mergeStateStatus: 'CLEAN',
            reviewDecision: '',
            viewerCanUpdate: true,
            labels: { nodes: [] },
            assignees: { nodes: [] },
            files: { pageInfo: { hasNextPage: false }, nodes: [{ path: 'README.md' }] },
            reviewRequests: { nodes: [{ requestedReviewer: { login: 'reviewer-one' } }] },
            reviews: { nodes: [{ author: { login: 'reviewer-one' }, state: 'APPROVED', submittedAt: '2026-07-20T00:00:00Z', commit: { oid: 'sha-2' } }] },
            timelineItems: { pageInfo: { hasNextPage: false }, nodes: [{ createdAt: '2026-07-19T00:00:00Z', requestedReviewer: { login: 'reviewer-one' } }] },
            ...pullOverrides,
          }],
        },
        ...repoOverrides,
      },
    },
  };
}

test('normalizeLive: approved PR with empty reviewDecision on an unprotected repo settles for the author (B1)', () => {
  const raw = () => JSON.stringify(pullFixture());
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.deepEqual(result.blockers, []);
  const settle = result.obligations.find((entry) => entry.kind === 'SETTLE');
  assert.ok(settle, 'expected a SETTLE obligation');
  assert.equal(settle.action, 'merge-pull-request');
});

test('normalizeLive: a single PR assignee becomes the settlement owner instead of the author (B2)', () => {
  const raw = () => JSON.stringify(pullFixture({ assignees: { nodes: [{ login: 'assignee-one' }] } }));
  const asAssignee = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'assignee-one', runGh: raw }));
  assert.equal(asAssignee.obligations.find((entry) => entry.kind === 'SETTLE')?.action, 'merge-pull-request');

  const asAuthor = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!asAuthor.obligations.some((entry) => entry.kind === 'SETTLE'));
});

test('normalizeLive: two PR assignees do not transfer settlement, so it stays with the author (B2)', () => {
  const raw = () => JSON.stringify(pullFixture({
    assignees: { nodes: [{ login: 'assignee-one' }, { login: 'assignee-two' }] },
  }));
  const asAuthor = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.equal(asAuthor.obligations.find((entry) => entry.kind === 'SETTLE')?.action, 'merge-pull-request');

  const asAssignee = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'assignee-one', runGh: raw }));
  assert.ok(!asAssignee.obligations.some((entry) => entry.kind === 'SETTLE'));
});

test('normalizeLive: an approval-ready but conflicting PR still settles, with a resolve-conflicts action (B1)', () => {
  const raw = () => JSON.stringify(pullFixture({ mergeable: 'CONFLICTING', mergeStateStatus: 'DIRTY' }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.deepEqual(result.blockers, []);
  const settle = result.obligations.find((entry) => entry.kind === 'SETTLE');
  assert.ok(settle, 'expected a SETTLE obligation');
  assert.equal(settle.action, 'resolve-conflicts-then-merge');
});

test('normalizeLive: an approval-ready Core PR blocks on unverified enforcement instead of going silent (B1 reachability)', () => {
  const raw = () => JSON.stringify(pullFixture({ files: { pageInfo: { hasNextPage: false }, nodes: [{ path: 'core/policy.md' }] } }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!result.obligations.some((entry) => entry.kind === 'SETTLE'));
  assert.equal(result.blockers[0]?.code, 'core-enforcement-unverified');
});

test('normalizeLive: a stale CHANGES_REQUESTED review does not obligate the author after a new revision, but the reviewer still owes re-review (I1)', () => {
  const raw = () => JSON.stringify(pullFixture({
    reviewDecision: 'CHANGES_REQUESTED',
    reviewRequests: { nodes: [] },
    reviews: { nodes: [{ author: { login: 'reviewer-two' }, state: 'CHANGES_REQUESTED', submittedAt: '2026-07-18T00:00:00Z', commit: { oid: 'sha-1' } }] },
    timelineItems: { pageInfo: { hasNextPage: false }, nodes: [{ createdAt: '2026-07-17T00:00:00Z', requestedReviewer: { login: 'reviewer-two' } }] },
  }));
  const authorView = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!authorView.obligations.some((entry) => entry.action === 'address-requested-changes'));

  const reviewerView = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'reviewer-two', runGh: raw }));
  const review = reviewerView.obligations.find((entry) => entry.kind === 'REVIEW');
  assert.ok(review, 'expected a REVIEW obligation for the reviewer');
  assert.equal(review.action, 're-review-current-revision');
  assert.ok(review.reasons.includes('stale-verdict'));
});

test('normalizeLive: an approval-ready PR that is BEHIND its base branch still settles, with a prepare-branch action (R2-1)', () => {
  const raw = () => JSON.stringify(pullFixture({ mergeable: 'MERGEABLE', mergeStateStatus: 'BEHIND' }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.deepEqual(result.blockers, []);
  const settle = result.obligations.find((entry) => entry.kind === 'SETTLE');
  assert.ok(settle, 'expected a SETTLE obligation');
  assert.equal(settle.action, 'prepare-branch-then-merge');
  assert.ok(settle.reasons.includes('approved-awaiting-mergeability'));
});

test('a leading-hyphen handle is never a valid GitHub login, so the first real @mention is designated (R2-4)', () => {
  const pending = item('D22', 'discussion', { title: '[ACK] Read this', body: '@-junk then @alice', reactions: [] });
  const aliceView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: 'alice', objects: [pending] });
  assert.deepEqual(aliceView.obligations.map((entry) => entry.kind), ['ACK']);

  const junkView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: '-junk', objects: [pending] });
  assert.equal(junkView.obligations.length, 0);
});

test('normalizeLive: a REVIEW_REQUIRED aggregate blocks settlement even with a current-revision approval present — the fallback must not override a non-empty aggregate (R2-5a)', () => {
  const raw = () => JSON.stringify(pullFixture({ reviewDecision: 'REVIEW_REQUIRED' }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!result.obligations.some((entry) => entry.kind === 'SETTLE'));
});

// Fable follow-up 1: on a protected repo (aggregate REVIEW_REQUIRED, so
// requiredApprovalSatisfied is false), a never-requested volunteer's current-revision
// APPROVED must NOT read as "someone has a claim" — GitHub itself doesn't recognize it
// as sufficient, so noReviewerHasBeenAsked's check #2 must ignore it and still obligate
// the author to request a reviewer, rather than going obligation-free for everyone.

test('normalizeLive: protected repo (REVIEW_REQUIRED), undesignated current-revision APPROVED, no requests -> author owes request-reviewer (fable follow-up 1)', () => {
  const raw = () => JSON.stringify(pullFixture({
    reviewDecision: 'REVIEW_REQUIRED',
    reviewRequests: { nodes: [] },
    reviews: { nodes: [{ author: { login: 'volunteer' }, state: 'APPROVED', submittedAt: '2026-07-21T00:00:00Z', commit: { oid: 'sha-2' } }] },
    timelineItems: { pageInfo: { hasNextPage: false }, nodes: [] },
  }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  const requestReviewer = result.obligations.find((entry) => entry.action === 'request-reviewer');
  assert.ok(requestReviewer, 'expected the author to owe request-reviewer');
  assert.equal(requestReviewer.kind, 'DECIDE/ACT');
  assert.ok(!result.obligations.some((entry) => entry.kind === 'SETTLE'));
  assert.equal(result.blockers.length, 0);
});

test('normalizeLive: on an unprotected repo (no aggregate), the SAME undesignated volunteer\'s current-revision APPROVED DOES satisfy readiness, so settlement fires instead of request-reviewer (fable follow-up 1, control)', () => {
  const raw = () => JSON.stringify(pullFixture({
    reviewDecision: '',
    reviewRequests: { nodes: [] },
    reviews: { nodes: [{ author: { login: 'volunteer' }, state: 'APPROVED', submittedAt: '2026-07-21T00:00:00Z', commit: { oid: 'sha-2' } }] },
    timelineItems: { pageInfo: { hasNextPage: false }, nodes: [] },
  }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!result.obligations.some((entry) => entry.action === 'request-reviewer'));
  const settle = result.obligations.find((entry) => entry.kind === 'SETTLE');
  assert.ok(settle, 'expected a SETTLE obligation for the author once the fallback readiness check passes');
  assert.equal(settle.action, 'merge-pull-request');
});

test('normalizeLive: on an unprotected repo, one reviewer\'s outstanding review request blocks settlement despite another reviewer\'s current-revision approval (R2-5b)', () => {
  const raw = () => JSON.stringify(pullFixture({
    reviewRequests: { nodes: [
      { requestedReviewer: { login: 'reviewer-one' } },
      { requestedReviewer: { login: 'reviewer-two' } },
    ] },
  }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.ok(!result.obligations.some((entry) => entry.kind === 'SETTLE'));
});

test('normalizeLive: a --for run under a different authenticated account surfaces the permissions caveat (R2-3)', () => {
  const raw = () => JSON.stringify({ ...pullFixture(), data: { ...pullFixture().data, viewer: { login: 'admin-account' } } });
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.equal(result.caveat, 'permissions-of-authenticated-viewer');
  assert.equal(result.authenticatedViewer, 'admin-account');
  assert.equal(result.viewer, 'author-one');
});

test('normalizeLive: a run under the matching authenticated account carries no caveat (R2-3)', () => {
  const raw = () => JSON.stringify({ ...pullFixture(), data: { ...pullFixture().data, viewer: { login: 'author-one' } } });
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.equal(result.caveat, undefined);
  assert.equal(result.authenticatedViewer, undefined);
});

// --- notices tier + native Q&A obligations ----------------------------------

test('a mention in a comment produces a notice and no obligation', () => {
  const mentioned = item('D23', 'discussion', {
    body: 'just some context',
    comments: [{ author: { login: 'someone-else' }, body: 'hey @reviewer-one can you take a look?' }],
  });
  const result = reduceObligations(base([mentioned]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.equal(result.notices[0].kind, 'NOTICE');
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
  assert.equal(result.notices[0].url, mentioned.url);
});

test('a mention on an object where the viewer already has an obligation does not also produce a notice', () => {
  const assignedAndMentioned = item('I24', 'issue', {
    body: '@reviewer-one please handle this',
    assignees: [{ login: viewer }],
  });
  const result = reduceObligations(base([assignedAndMentioned]));
  assert.equal(result.obligations.length, 1);
  assert.equal(result.notices.length, 0);
});

// F1: a completed round must not resurface as a standing notice for the person who
// completed it — the formal signal (ACK recipient / requested reviewer / assignee)
// suppresses the mention regardless of whether the round is still open.

test('F1: a completed ACK (eyes already added) that also mentions the recipient produces no notice', () => {
  const completedAck = item('D50', 'discussion', {
    title: '[ACK] Read this',
    body: '@reviewer-one please read and ack',
    reactions: [{ content: 'EYES', user: { login: viewer } }],
  });
  const result = reduceObligations(base([completedAck]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('F1: a reviewer who already submitted their current-revision verdict and is also mentioned produces no notice', () => {
  const verdictedAndMentioned = item('P51', 'pull_request', {
    title: 'Please look, @reviewer-one',
    currentRevision: 'rev-a',
    reviewRequests: [{ reviewer: viewer, revision: 'rev-a', active: true }],
    reviews: [{ author: { login: viewer }, state: 'APPROVED', revision: 'rev-a' }],
  });
  const result = reduceObligations(base([verdictedAndMentioned]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

// Moved from a Discussion fixture to an Issue one by ADR-097: the original D52 fixture
// ('cc @reviewer-one for visibility' on a plain Discussion) is now exactly the
// Announcements-tier receipt trigger (see the ADR-097 test above), so it no longer
// demonstrates "not a blanket suppression" — it demonstrates the opposite, on purpose.
// The underlying F1 principle (a formal-signal carve-out doesn't suppress EVERY mention,
// only the ones that actually hold a formal signal) still needs coverage on an object
// type receipt-default doesn't touch — an Issue.
test('F1: an uninvolved mentioned third party still gets a notice on an Issue — the formal-signal carve-out is not a blanket suppression', () => {
  const mentionedStranger = item('I52', 'issue', {
    body: 'cc @reviewer-one for visibility',
  });
  const result = reduceObligations(base([mentionedStranger]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

// F2(b): a viewer who owns settlement with satisfied approval but lacks merge authority
// gets a visible blocker instead of silence — per-viewer data can't reveal whether some
// OTHER account could merge it.

test('F2(b): settlement owner with satisfied approval but no merge authority gets a settlement-owner-cannot-merge blocker, not silence', () => {
  const lockedOut = item('P53', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: false,
    requiredApprovalSatisfied: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const result = reduceObligations(base([lockedOut]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.blockers.length, 1);
  assert.equal(result.blockers[0].code, 'settlement-owner-cannot-merge');
  assert.equal(result.blockers[0].url, lockedOut.url);
});

// F3: a blocker on the object suppresses its mention notice too, the same way an
// obligation does — otherwise a mentioned author of a blocked Core PR sees both.

test('F3: a blocker on the object suppresses its mention notice — a mentioned author of a blocked Core PR sees only the blocker', () => {
  const blockedCore = item('P54', 'pull_request', {
    title: 'Core change, @reviewer-one please note',
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    coreGateEnforced: false,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const result = reduceObligations(base([blockedCore]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.blockers.length, 1);
  assert.equal(result.blockers[0].code, 'core-enforcement-unverified');
  assert.equal(result.notices.length, 0);
});

// F4: text the viewer authored themselves that happens to @mention them is not a notice
// — naming yourself in your own comment is not someone pinging you.

test('F4: a self-authored comment naming the viewer produces no self-notice', () => {
  const selfMention = item('D55', 'discussion', {
    body: 'unrelated context',
    comments: [{ author: { login: viewer }, body: 'noting for the record, @reviewer-one will follow up' }],
  });
  const result = reduceObligations(base([selfMention]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

// Restored to its pre-ADR-096 expectation by ADR-096 v2: an intermediate draft of
// ADR-096 made ALL engagement atemporal, so this fixture briefly flipped to
// "suppressed" — but that re-opened ADR-093's founding scenario (a later "@person please
// respond" comment in a thread the person once touched would go silent forever). ADR-096
// v2 makes comment-borne suppression TEMPORAL: the mention fires again here because the
// stranger's mention comment (T2) arrives AFTER the viewer's own last comment (T1).
test('F4: a stranger mentioning the viewer in a comment AFTER the viewer\'s own earlier comment still notices — ADR-096 v2 makes comment-borne suppression temporal, not atemporal', () => {
  const mixedThread = item('D56', 'discussion', {
    body: 'unrelated context',
    comments: [
      { author: { login: viewer }, body: 'my own note, no mention here', createdAt: '2026-07-21T01:00:00Z' }, // T1
      { author: { login: 'someone-else' }, body: '@reviewer-one can you weigh in?', createdAt: '2026-07-21T02:00:00Z' }, // T2 > T1
    ],
  });
  const result = reduceObligations(base([mixedThread]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

test('ADR-096 v2: a stranger\'s comment mention followed by the viewer\'s own LATER comment is suppressed — the viewer has since seen the thread', () => {
  const thread = item('D64', 'discussion', {
    body: 'unrelated context',
    comments: [
      { author: { login: 'someone-else' }, body: '@reviewer-one can you weigh in?', createdAt: '2026-07-21T01:00:00Z' }, // T_mention
      { author: { login: viewer }, body: 'yep, looking now', createdAt: '2026-07-21T02:00:00Z' }, // T3 > T_mention
    ],
  });
  const result = reduceObligations(base([thread]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('ADR-096 v2: a viewer\'s 👀 does not suppress a comment-borne mention — 👀 carries no timestamp, so it only ever covers a title/body mention', () => {
  const discussion = item('D65', 'discussion', {
    body: 'unrelated context',
    reactions: [{ content: 'EYES', user: { login: viewer } }],
    comments: [{ author: { login: 'someone-else' }, body: '@reviewer-one can you weigh in?', createdAt: '2026-07-21T01:00:00Z' }],
  });
  const result = reduceObligations(base([discussion]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

test('ADR-096 v2: a comment mention with no createdAt (legacy fixture) is suppressed once the viewer has commented at all — treated as older than everything', () => {
  const thread = item('D66', 'discussion', {
    body: 'unrelated context',
    comments: [
      { author: { login: 'someone-else' }, body: '@reviewer-one can you weigh in?' }, // no createdAt
      { author: { login: viewer }, body: 'noted' }, // no createdAt either
    ],
  });
  const result = reduceObligations(base([thread]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

// Fable full-unit review, I2 (Important): formal-signal suppression (F1) — and receipt-
// obligation completion — must apply to TITLE/BODY mentions only. A COMMENT-borne mention
// is governed SOLELY by the temporal rule, regardless of any formal signal or completed
// receipt on the object: a named recipient who already gave their 👀 is not deaf to a
// LATER "@them please respond" comment. The pre-fix code gated the whole notice check
// (both sources) behind hasFormalSignal(), silently re-opening ADR-093's founding failure
// for anyone who also happened to hold a formal signal on the object. An OPEN obligation
// still suppresses everything (unchanged) — only the completed/absent-obligation case
// needed the fix.

test('I2: a completed-receipt recipient still gets a notice for a comment mention that arrives AFTER their own last comment', () => {
  const announcement = item('D90', 'discussion', {
    title: '[ACK] Policy update',
    body: '@reviewer-one please read this',
    reactions: [{ content: 'EYES', user: { login: viewer } }], // receipt already given
    comments: [
      { author: { login: viewer }, body: 'read it, thanks', createdAt: '2026-07-22T01:00:00Z' }, // T1
      { author: { login: 'someone-else' }, body: '@reviewer-one one more thing', createdAt: '2026-07-22T02:00:00Z' }, // T2 > T1
    ],
  });
  const result = reduceObligations(base([announcement]));
  assert.equal(result.obligations.length, 0, 'the receipt is already complete');
  assert.equal(result.notices.length, 1, 'a later comment mention still surfaces — formal signal never covers comment mentions');
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

test('I2: the same completed-receipt recipient gets NO notice when the comment mention PREDATES their own last comment', () => {
  const announcement = item('D91', 'discussion', {
    title: '[ACK] Policy update',
    body: '@reviewer-one please read this',
    reactions: [{ content: 'EYES', user: { login: viewer } }],
    comments: [
      { author: { login: 'someone-else' }, body: '@reviewer-one one more thing', createdAt: '2026-07-22T01:00:00Z' }, // T1
      { author: { login: viewer }, body: 'saw it, all good', createdAt: '2026-07-22T02:00:00Z' }, // T2 > T1
    ],
  });
  const result = reduceObligations(base([announcement]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('I2: an OPEN obligation on the object still suppresses a comment-borne mention too — unchanged', () => {
  const announcement = item('D92', 'discussion', {
    title: '[ACK] Policy update',
    body: '@reviewer-one please read this',
    reactions: [], // receipt NOT yet given -> the viewer has an OPEN ACK obligation
    comments: [{ author: { login: 'someone-else' }, body: '@reviewer-one any update?', createdAt: '2026-07-22T01:00:00Z' }],
  });
  const result = reduceObligations(base([announcement]));
  assert.deepEqual(result.obligations.map((entry) => entry.kind), ['ACK']);
  assert.equal(result.notices.length, 0, 'the open obligation supersedes the comment mention too — no duplicate nag');
});

// ADR-096: engagement (a comment the viewer authored, or — Discussions only — the
// viewer's own 👀) suppresses a mentioned-in-prose notice for a TITLE/BODY mention,
// atemporally — an edit carries no per-mention timestamp, so "the viewer has looked at
// this object at some point" is the only signal available. The four tests below are all
// title/body fixtures, so they are unaffected by ADR-096 v2's temporal comment rule
// (see the comment-mention tests above, which restore/extend F4 for that rule).

test('ADR-096: a viewer who commented on an FYI that mentions them gets no notice', () => {
  const fyi = item('D60', 'discussion', {
    title: '[FYI] Status update',
    isFYI: true,
    body: '@reviewer-one heads up on this',
    comments: [{ author: { login: viewer }, body: 'thanks, saw it' }],
  });
  const result = reduceObligations(base([fyi]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('ADR-096: a viewer who left 👀 on a Discussion that mentions them gets no notice', () => {
  const discussion = item('D61', 'discussion', {
    body: '@reviewer-one take a look',
    reactions: [{ content: 'EYES', user: { login: viewer } }],
  });
  const result = reduceObligations(base([discussion]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('ADR-096: a viewer who commented on an Issue that mentions them gets no notice (comment-engagement is what covers Issues/PRs — no reaction data is fetched for them)', () => {
  const issue = item('I63', 'issue', {
    body: '@reviewer-one please check this',
    comments: [{ author: { login: viewer }, body: 'looking into it' }],
  });
  const result = reduceObligations(base([issue]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('ADR-096: an uninvolved mentioned viewer — no comment, no eyes — still gets a notice; engagement suppression is not blanket', () => {
  const untouched = item('D62', 'discussion', {
    title: '[FYI] Status update',
    isFYI: true,
    body: '@reviewer-one heads up on this',
  });
  const result = reduceObligations(base([untouched]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

// The tests below drive reduceObligations directly with a pre-normalized fixture — the
// same post-normalize flat `isAnswerable` shape normalizeLive produces from the real
// GraphQL `category { isAnswerable }` field (see the normalizeLive-level test further
// down, which exercises the actual nested wire shape and the query fix for B1).

test('Q&A authored by the viewer, unanswered, with a stranger comment: DECIDE/ACT accept-answer-or-follow-up', () => {
  const question = item('D25', 'discussion', {
    isAnswerable: true,
    isAnswered: false,
    author: { login: viewer },
    comments: [{ author: { login: 'someone-else' }, body: 'here is an answer' }],
  });
  const [result] = reduceObligations(base([question])).obligations;
  assert.equal(result.kind, 'DECIDE/ACT');
  assert.equal(result.action, 'accept-answer-or-follow-up');
  assert.ok(result.reasons.includes('question-has-unaccepted-answers'));
});

test('F5(a): a comment from a deleted/ghost account (null author) never counts as a stranger for Q&A', () => {
  const question = item('D57', 'discussion', {
    isAnswerable: true,
    isAnswered: false,
    author: { login: viewer },
    comments: [{ author: null, body: 'ghost comment from a deleted account' }],
  });
  const result = reduceObligations(base([question]));
  assert.equal(result.obligations.length, 0);
});

test('Q&A authored by the viewer, unanswered, with no other comments: no obligation, no notice', () => {
  const question = item('D29', 'discussion', {
    isAnswerable: true,
    isAnswered: false,
    author: { login: viewer },
    comments: [],
  });
  const result = reduceObligations(base([question]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('Q&A authored by the viewer, answered and still open: SETTLE close-answered-question', () => {
  const answered = item('D26', 'discussion', {
    isAnswerable: true,
    isAnswered: true,
    author: { login: viewer },
    comments: [{ author: { login: 'someone-else' }, body: 'accepted answer' }],
  });
  const [result] = reduceObligations(base([answered])).obligations;
  assert.equal(result.kind, 'SETTLE');
  assert.equal(result.action, 'close-answered-question');
});

test('Q&A where the viewer is only mentioned, not the author: notice only, no obligation', () => {
  const question = item('D27', 'discussion', {
    isAnswerable: true,
    isAnswered: false,
    author: { login: 'someone-else' },
    body: '@reviewer-one any thoughts?',
    comments: [],
  });
  const result = reduceObligations(base([question]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});

test('own non-draft PR with no review requests and no reviews: DECIDE/ACT request-reviewer obligation, not a notice', () => {
  const lonely = item('P28', 'pull_request', {
    author: { login: viewer },
    isDraft: false,
    reviewRequests: [],
    reviews: [],
  });
  const result = reduceObligations(base([lonely]));
  assert.equal(result.notices.length, 0);
  const [obligation] = result.obligations;
  assert.equal(obligation.kind, 'DECIDE/ACT');
  assert.equal(obligation.action, 'request-reviewer');
  assert.ok(obligation.reasons.includes('no-reviewer-requested'));
});

test('own draft PR with no review requests and no reviews: nothing at all — drafts stay exempt', () => {
  const draft = item('P30', 'pull_request', {
    author: { login: viewer },
    isDraft: true,
    reviewRequests: [],
    reviews: [],
  });
  const result = reduceObligations(base([draft]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('invariant: an open non-draft PR always yields at least one obligation for the right party', () => {
  const author = 'pr-author';
  const noReviewer = item('P40', 'pull_request', {
    author: { login: author },
    isDraft: false,
    reviewRequests: [],
    reviews: [],
  });
  const requested = item('P41', 'pull_request', {
    author: { login: author },
    currentRevision: 'rev-a',
    reviewRequests: [{ reviewer: viewer, revision: 'rev-a', active: true }],
  });
  const changesRequested = item('P42', 'pull_request', {
    author: { login: author },
    currentRevision: 'rev-a',
    reviews: [{ author: { login: 'reviewer-two' }, state: 'CHANGES_REQUESTED', revision: 'rev-a' }],
  });
  const approvedClean = item('P43', 'pull_request', {
    author: { login: author },
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeReady: true,
    requestedReviewers: ['reviewer-two'],
  });
  const approvedConflicting = item('P44', 'pull_request', {
    author: { login: author },
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeable: 'CONFLICTING',
    requestedReviewers: ['reviewer-two'],
  });
  const approvedBehind = item('P45', 'pull_request', {
    author: { login: author },
    files: [{ path: 'briefs/current.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BEHIND',
    requestedReviewers: ['reviewer-two'],
  });
  // Counter-state (a) — B2: a drive-by COMMENTED review from a never-requested party is
  // not a claim on the PR. COMMENTED never counts as a verdict, from anyone.
  const nonDesignatedCommentOnly = item('P46', 'pull_request', {
    author: { login: author },
    currentRevision: 'rev-a',
    reviewRequests: [],
    reviews: [{ author: { login: 'drive-by-commenter' }, state: 'COMMENTED', revision: 'rev-a' }],
  });
  // Counter-state (b) — B2: an old-revision APPROVED from a party who was never
  // requested is not a historically-designated reviewer's stale verdict; it doesn't
  // block the author's obligation either.
  const nonDesignatedStaleApproval = item('P47', 'pull_request', {
    author: { login: author },
    currentRevision: 'rev-b',
    reviewRequests: [],
    reviews: [{ author: { login: 'drive-by-approver' }, state: 'APPROVED', revision: 'rev-a' }],
  });

  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: author, objects: [noReviewer, changesRequested, approvedClean, approvedConflicting, approvedBehind, nonDesignatedCommentOnly, nonDesignatedStaleApproval] });
  assert.equal(authorView.obligations.find((o) => o.url === noReviewer.url)?.action, 'request-reviewer');
  assert.equal(authorView.obligations.find((o) => o.url === changesRequested.url)?.action, 'address-requested-changes');
  assert.equal(authorView.obligations.find((o) => o.url === approvedClean.url)?.action, 'merge-pull-request');
  assert.equal(authorView.obligations.find((o) => o.url === approvedConflicting.url)?.action, 'resolve-conflicts-then-merge');
  assert.equal(authorView.obligations.find((o) => o.url === approvedBehind.url)?.action, 'prepare-branch-then-merge');
  assert.equal(authorView.obligations.find((o) => o.url === nonDesignatedCommentOnly.url)?.action, 'request-reviewer');
  assert.equal(authorView.obligations.find((o) => o.url === nonDesignatedStaleApproval.url)?.action, 'request-reviewer');

  const reviewerView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer, objects: [requested] });
  assert.equal(reviewerView.obligations.find((o) => o.url === requested.url)?.kind, 'REVIEW');
});

test('B2: a historically-designated reviewer\'s stale verdict blocks the author\'s request-reviewer obligation — it routes a re-review obligation to that reviewer instead', () => {
  const author = 'pr-author';
  const designatedReviewer = 'designated-reviewer';
  const staleApprovalFromDesignated = item('P48', 'pull_request', {
    author: { login: author },
    currentRevision: 'rev-b',
    // The request is no longer active (withdrawn/superseded), but the reviewer was
    // historically designated — their stale APPROVED still means someone has a claim.
    reviewRequests: [{ reviewer: designatedReviewer, revision: 'rev-a', active: false }],
    reviews: [{ author: { login: designatedReviewer }, state: 'APPROVED', revision: 'rev-a' }],
  });
  const authorView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: author, objects: [staleApprovalFromDesignated] });
  assert.ok(!authorView.obligations.some((o) => o.action === 'request-reviewer'));

  const reviewerView = reduceObligations({ source: 'fixture', repository: 'example/project', viewer: designatedReviewer, objects: [staleApprovalFromDesignated] });
  const review = reviewerView.obligations.find((o) => o.kind === 'REVIEW');
  assert.ok(review, 'expected the designated reviewer to owe a re-review');
  assert.ok(review.reasons.includes('stale-verdict'));
});

test('a closed Discussion with a mention produces neither an obligation nor a notice', () => {
  const closed = item('D31', 'discussion', {
    body: '@reviewer-one closing thought',
    closed: true,
  });
  const result = reduceObligations(base([closed]));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('normalizeLive: the comment scan self-reports commentScanTruncated when a fixture hits the cap', () => {
  const raw = () => JSON.stringify({
    data: {
      repository: {
        viewerPermission: 'WRITE',
        defaultBranchRef: { name: 'main', branchProtectionRule: null },
        discussions: {
          pageInfo: { hasNextPage: false },
          nodes: [{
            id: 'D_2',
            number: 32,
            title: 'Busy thread',
            url: 'https://github.com/example/project/discussions/32',
            body: '',
            closed: false,
            isAnswered: false,
            category: { isAnswerable: false },
            labels: { nodes: [] },
            reactions: { pageInfo: { hasNextPage: false }, nodes: [] },
            comments: { pageInfo: { hasNextPage: true }, nodes: [{ author: { login: 'someone-else' }, body: 'part of a long thread' }] },
          }, {
            // F5(b): a CLOSED thread that also exceeds the comment cap must not appear in
            // commentScanTruncated — the self-report is scoped to objects still in play.
            id: 'D_4',
            number: 34,
            title: 'Old busy thread, now closed',
            url: 'https://github.com/example/project/discussions/34',
            body: '',
            closed: true,
            isAnswered: false,
            category: { isAnswerable: false },
            labels: { nodes: [] },
            reactions: { pageInfo: { hasNextPage: false }, nodes: [] },
            comments: { pageInfo: { hasNextPage: true }, nodes: [{ author: { login: 'someone-else' }, body: 'part of a long closed thread' }] },
          }],
        },
        issues: { pageInfo: { hasNextPage: false }, nodes: [] },
        pullRequests: { pageInfo: { hasNextPage: false }, nodes: [] },
      },
    },
  });
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'author-one', runGh: raw }));
  assert.equal(result.commentScanTruncated.length, 1);
  assert.equal(result.commentScanTruncated[0].url, 'https://github.com/example/project/discussions/32');
});

// Superseded by ADR-097 (receipt-default): I2's original point was "the first @mention
// wins, later mentions are just context" — bob, mentioned second, owed nothing. ADR-097
// replaces that with "every named account owes its own receipt," so bob now owes an ACK
// too. The email-address guard this test also covers (`team@example.com` never reads as
// a mention of `example`) is untouched by ADR-097 and still holds.
test('normalizeLive: ADR-097 receipt-default — EVERY @mentioned account owes its own ACK, not just the first; an email address still never reads as a mention (supersedes the old first-mention-only I2 test)', () => {
  const raw = () => JSON.stringify({
    data: {
      repository: {
        viewerPermission: 'WRITE',
        defaultBranchRef: { name: 'main', branchProtectionRule: null },
        discussions: {
          pageInfo: { hasNextPage: false },
          nodes: [{
            id: 'D_1',
            number: 30,
            title: '[ACK] Policy update',
            url: 'https://github.com/example/project/discussions/30',
            body: '@alice please read and ack. cc @bob for awareness. Contact team@example.com with questions.',
            closed: false,
            isAnswered: false,
            labels: { nodes: [] },
            reactions: { pageInfo: { hasNextPage: false }, nodes: [] },
          }],
        },
        issues: { pageInfo: { hasNextPage: false }, nodes: [] },
        pullRequests: { pageInfo: { hasNextPage: false }, nodes: [] },
      },
    },
  });
  const aliceView = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'alice', runGh: raw }));
  assert.deepEqual(aliceView.obligations.map((entry) => entry.kind), ['ACK']);

  const bobView = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'bob', runGh: raw }));
  assert.deepEqual(bobView.obligations.map((entry) => entry.kind), ['ACK']);

  // 'team@example.com' must never parse as a mention of the login 'example'.
  const emailLoginView = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'example', runGh: raw }));
  assert.equal(emailLoginView.obligations.length, 0);
});

// B1 regression: isAnswerable lives on DiscussionCategory in the real GraphQL schema, not
// on Discussion itself — a flat `isAnswerable` field on the Discussion node (what the
// fixture-tier Q&A tests above use, correctly, since that's the POST-normalize shape) is
// not a real `gh api graphql` response and would fail on every live repo. This test drives
// the actual wire shape (`category { isAnswerable }`) through normalizeLive to prove the
// query fix works and to close the coverage gap that let the wrong shape ship.

function discussionFixture(discussionOverrides = {}) {
  return {
    data: {
      repository: {
        viewerPermission: 'WRITE',
        defaultBranchRef: { name: 'main', branchProtectionRule: null },
        discussions: {
          pageInfo: { hasNextPage: false },
          nodes: [{
            id: 'D_3',
            number: 33,
            title: 'Does this approach work?',
            url: 'https://github.com/example/project/discussions/33',
            body: '',
            closed: false,
            isAnswered: false,
            category: { isAnswerable: true },
            author: { login: 'question-author' },
            labels: { nodes: [] },
            reactions: { pageInfo: { hasNextPage: false }, nodes: [] },
            comments: { pageInfo: { hasNextPage: false }, nodes: [{ author: { login: 'someone-else' }, body: 'here is an answer' }] },
            ...discussionOverrides,
          }],
        },
        issues: { pageInfo: { hasNextPage: false }, nodes: [] },
        pullRequests: { pageInfo: { hasNextPage: false }, nodes: [] },
      },
    },
  };
}

test('normalizeLive: the real category{isAnswerable} shape drives a native Q&A obligation (B1)', () => {
  const raw = () => JSON.stringify(discussionFixture());
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'question-author', runGh: raw }));
  const [obligation] = result.obligations;
  assert.equal(obligation.kind, 'DECIDE/ACT');
  assert.equal(obligation.action, 'accept-answer-or-follow-up');
});

test('normalizeLive: a Discussion whose category is not answerable never produces a Q&A obligation, even with a stranger comment (B1)', () => {
  const raw = () => JSON.stringify(discussionFixture({ category: { isAnswerable: false } }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'question-author', runGh: raw }));
  assert.equal(result.obligations.length, 0);
});

test('normalizeLive: a Discussion with no category at all (e.g. General) is treated as not answerable, not as a crash (B1)', () => {
  const raw = () => JSON.stringify(discussionFixture({ category: null }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'question-author', runGh: raw }));
  assert.equal(result.obligations.length, 0);
});

// Fable follow-up 2: the issues selection previously fetched no author{login}, so
// mentionsOfOthers had nothing to attribute an issue's title/body to and a self-mention
// in one's own issue body still self-noticed. author{login} now flows through the
// existing `...value` spread with no further transform needed.

function issueFixture(issueOverrides = {}) {
  return {
    data: {
      repository: {
        viewerPermission: 'WRITE',
        defaultBranchRef: { name: 'main', branchProtectionRule: null },
        discussions: { pageInfo: { hasNextPage: false }, nodes: [] },
        issues: {
          pageInfo: { hasNextPage: false },
          nodes: [{
            id: 'I_1',
            number: 40,
            title: 'Some task',
            url: 'https://github.com/example/project/issues/40',
            body: 'noting for the record, @issue-author will follow up',
            state: 'OPEN',
            author: { login: 'issue-author' },
            issueType: null,
            labels: { nodes: [] },
            assignees: { nodes: [] },
            comments: { pageInfo: { hasNextPage: false }, nodes: [] },
            ...issueOverrides,
          }],
        },
        pullRequests: { pageInfo: { hasNextPage: false }, nodes: [] },
      },
    },
  };
}

test('normalizeLive: a self-mention in the viewer\'s own issue body produces no notice (fable follow-up 2)', () => {
  const raw = () => JSON.stringify(issueFixture());
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'issue-author', runGh: raw }));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 0);
});

test('normalizeLive: someone else\'s issue body mentioning the viewer still produces a notice (fable follow-up 2)', () => {
  const raw = () => JSON.stringify(issueFixture({
    body: 'noting for the record, @reviewer-one will follow up',
    author: { login: 'someone-else' },
  }));
  const result = reduceObligations(collectGitHubPrimitives({ repository: 'example/project', viewer: 'reviewer-one', runGh: raw }));
  assert.equal(result.obligations.length, 0);
  assert.equal(result.notices.length, 1);
  assert.deepEqual(result.notices[0].reasons, ['mentioned-in-prose']);
});
