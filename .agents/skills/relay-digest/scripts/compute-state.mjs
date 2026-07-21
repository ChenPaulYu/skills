#!/usr/bin/env node
// relay:digest — collect GitHub primitives, then reduce them to viewer obligations.
// Collection is intentionally separate from the deterministic reducer: fixture JSON
// exercises semantics without network access, while live use shells out only to `gh`.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const SCHEMA_VERSION = 1;

const loginOf = (actor) => typeof actor === 'string' ? actor : actor?.login || actor?.slug || null;
const sameLogin = (left, right) => Boolean(left && right && left.toLowerCase() === right.toLowerCase());
const unique = (values) => [...new Set(values.filter(Boolean))];
const hasLabel = (object, label) => (object.labels || []).some((value) =>
  (typeof value === 'string' ? value : value?.name)?.toLowerCase() === label.toLowerCase());
const isOpen = (object) => !object.state || object.state.toUpperCase() === 'OPEN';

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

function designatedAckRecipient(object) {
  if (object.ackRecipient) return loginOf(object.ackRecipient);
  if (!/^\s*\[ACK\]/i.test(object.title || '') && !hasLabel(object, 'ack-required')) return null;
  const recipients = unique((`${object.title || ''}\n${object.body || ''}`.match(/@[a-z\d](?:[a-z\d-]{0,37})/ig) || [])
    .map((match) => match.slice(1).toLowerCase()));
  return recipients.length === 1 ? recipients[0] : null;
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
  if (input.blocked) return { ...input, schemaVersion: SCHEMA_VERSION, obligations: [] };
  const viewer = input.viewer;
  if (!viewer) {
    return {
      schemaVersion: SCHEMA_VERSION,
      source: input.source || 'fixture',
      repository: input.repository || null,
      viewer: null,
      blocked: { code: 'viewer-unresolved', message: 'Could not resolve the authenticated GitHub viewer.' },
      obligations: [],
    };
  }

  const byId = new Map();
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
      const touchesCore = object.isCore === true || (object.files || []).some((file) =>
        String(typeof file === 'string' ? file : file?.path || '').startsWith('core/'));
      const mergeReady = object.mergeReady === true ||
        (String(object.mergeable).toUpperCase() === 'MERGEABLE' && String(object.mergeStateStatus).toUpperCase() === 'CLEAN');
      if (touchesCore && object.viewerCanSettle === true && object.requiredApprovalSatisfied === true && mergeReady) {
        const item = obligation('SETTLE', object, 'core-approved-current-revision', 'merge-core');
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
    obligations,
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
    repository(owner:$owner,name:$name){
      viewerPermission
      discussions(first:100){
        pageInfo{hasNextPage}
        nodes{id number title body url isAnswered labels(first:20){nodes{name}} reactions(first:100,content:EYES){pageInfo{hasNextPage} nodes{content user{login}}}}
      }
      issues(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state issueType{name} labels(first:20){nodes{name}} assignees(first:10){nodes{login}} comments(last:50){nodes{author{login} body createdAt}}}
      }
      pullRequests(first:100,states:OPEN){
        pageInfo{hasNextPage}
        nodes{id number title body url state headRefOid mergeable mergeStateStatus reviewDecision viewerCanUpdate labels(first:20){nodes{name}} assignees(first:10){nodes{login}} files(first:100){pageInfo{hasNextPage} nodes{path}} reviewRequests(first:50){nodes{requestedReviewer{... on User{login} ... on Team{slug}}}} reviews(last:100){nodes{author{login} state submittedAt commit{oid}}} timelineItems(first:100,itemTypes:[REVIEW_REQUESTED_EVENT]){pageInfo{hasNextPage} nodes{... on ReviewRequestedEvent{createdAt requestedReviewer{... on User{login} ... on Team{slug}}}}}}
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
    return {
      ...value,
      type: 'pull_request',
      currentRevision: value.headRefOid,
      labels: flattenConnection(value.labels),
      assignees: flattenConnection(value.assignees),
      files: flattenConnection(value.files),
      requestedReviewers: activeRequests,
      reviewRequests: requestHistory,
      reviews: flattenConnection(value.reviews).map((review) => ({ ...review, revision: review.commit?.oid })),
      isCore: flattenConnection(value.files).some((file) => file.path?.startsWith('core/')),
      viewerCanSettle: ['ADMIN', 'MAINTAIN', 'WRITE'].includes(repo.viewerPermission) && value.viewerCanUpdate === true,
      requiredApprovalSatisfied: value.reviewDecision === 'APPROVED',
      mergeReady: value.mergeable === 'MERGEABLE' && value.mergeStateStatus === 'CLEAN',
    };
  });
  return { schemaVersion: SCHEMA_VERSION, source: 'github', repository, viewer, objects: [...discussions, ...issues, ...pullRequests] };
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
      obligations: [],
    }, null, 2)}\n`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli();
}
