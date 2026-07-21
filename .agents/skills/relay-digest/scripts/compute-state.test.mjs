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
    reviews: [{ author: { login: 'reviewer-two' }, state: 'CHANGES_REQUESTED', revision: 'rev-a' }],
  });
  const [authorAction] = reduceObligations(base([pull])).obligations;
  assert.equal(authorAction.kind, 'DECIDE/ACT');
  assert.equal(authorAction.action, 'address-requested-changes');

  pull.currentRevision = 'rev-b';
  assert.equal(reduceObligations(base([pull])).obligations.length, 0);
});

test('a later approval on the same revision clears the author change request', () => {
  const pull = item('P19', 'pull_request', {
    author: { login: viewer },
    currentRevision: 'rev-a',
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
  });
  const approvalMissing = item('P10', 'pull_request', {
    author: { login: viewer },
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: false,
    coreGateEnforced: true,
    mergeReady: true,
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
  });
  const [result] = reduceObligations(base([ready])).obligations;
  assert.equal(result.kind, 'SETTLE');
  assert.equal(result.action, 'merge-core');
});

test('mention-only and FYI traffic produce no obligation', () => {
  const mention = item('D12', 'discussion', { body: '@reviewer-one can you look?', reactions: [] });
  const fyi = item('D13', 'discussion', { title: '[FYI] Status', body: '@reviewer-one', isFYI: true });
  assert.equal(reduceObligations(base([mention, fyi])).obligations.length, 0);
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

test('normalizeLive: ACK routes to the first @mention, ignoring a later mention and an email address (I2)', () => {
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
  assert.equal(bobView.obligations.length, 0);
});
