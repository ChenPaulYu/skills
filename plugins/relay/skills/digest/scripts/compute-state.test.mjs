import test from 'node:test';
import assert from 'node:assert/strict';

import { collectGitHubPrimitives, reduceObligations } from './compute-state.mjs';

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

test('designated ACK remains until that account adds eyes', () => {
  const pending = item('D1', 'discussion', { title: '[ACK] Read this', body: '@reviewer-one', reactions: [] });
  assert.deepEqual(reduceObligations(base([pending])).obligations.map((entry) => entry.kind), ['ACK']);

  pending.reactions.push({ content: 'EYES', user: { login: viewer } });
  assert.equal(reduceObligations(base([pending])).obligations.length, 0);
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

test('Core settlement excludes unauthorized viewers, ordinary PRs, and unsatisfied approval gates', () => {
  const unauthorized = item('P8', 'pull_request', {
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: false,
    requiredApprovalSatisfied: true,
    mergeReady: true,
  });
  const ordinary = item('P9', 'pull_request', {
    files: [{ path: 'src/index.js' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
    mergeReady: true,
  });
  const approvalMissing = item('P10', 'pull_request', {
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: false,
    mergeReady: true,
  });
  assert.equal(reduceObligations(base([unauthorized, ordinary, approvalMissing])).obligations.length, 0);
});

test('Core settlement appears only for an authorized viewer with satisfied current gates', () => {
  const ready = item('P11', 'pull_request', {
    files: [{ path: 'core/policy.md' }],
    viewerCanSettle: true,
    requiredApprovalSatisfied: true,
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
