/**
 * Tiny pub/sub: ViewPostScreen emits on blur. PostScreen subscribes on mount.
 * Avoids waiting on AsyncStorage + /posts before the NEW badge clears.
 */

const listeners = new Set();

export function emitPostThreadViewed({ postId, groupId }) {
  const payload = { postId: String(postId), groupId: String(groupId) };
  listeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (_) {}
  });
}

export function subscribePostThreadViewed(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
