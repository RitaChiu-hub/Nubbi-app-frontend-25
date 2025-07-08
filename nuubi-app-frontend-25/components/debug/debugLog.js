import { DEBUG_ON, debugBuffer } from "./DebugOverlay";

export function debugLog(tag, data) {
  if (!DEBUG_ON) return;

  const msg =
    "[" +
    new Date().toLocaleTimeString() +
    "] " +
    tag +
    ": " +
    (typeof data === "string" ? data : JSON.stringify(data));

  debugBuffer.unshift(msg);
  if (debugBuffer.length > 50) debugBuffer.pop();
}
