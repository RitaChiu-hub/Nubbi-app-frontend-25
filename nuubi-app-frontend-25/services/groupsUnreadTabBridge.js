/**
 * My Groups screen publishes unread state so the bottom-tab Groups icon can show a dot.
 */

const listeners = new Set();
let lastValue = false;

export function emitGroupsTabUnread(hasAny) {
  const v = !!hasAny;
  lastValue = v;
  listeners.forEach((fn) => {
    try {
      fn(v);
    } catch (_) {}
  });
}

export function subscribeGroupsTabUnread(fn) {
  fn(lastValue);
  listeners.add(fn);
  return () => listeners.delete(fn);
}
