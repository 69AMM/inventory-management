// Thin wrapper around localStorage that simulates a real async API layer.
// Every service function returns a Promise and can, in principle, fail —
// callers are expected to handle loading/error states.

const NAMESPACE = 'inventory_app';

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${key}`);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read localStorage key "${key}"`, err);
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write localStorage key "${key}"`, err);
    return false;
  }
}

// Simulates real network latency so loading states are meaningful in the UI.
export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
