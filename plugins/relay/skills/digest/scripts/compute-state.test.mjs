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
