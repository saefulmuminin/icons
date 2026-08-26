/**
 * A one-second clock exposed as an external store, so components can read the
 * current time through `useSyncExternalStore` instead of driving a timer with
 * state updates inside an effect.
 *
 * A single interval is shared by every subscriber and stops once the last one
 * unsubscribes. `getServerSnapshot` returns null so server-rendered markup can
 * show a placeholder and hydrate without a mismatch.
 */
let now = Date.now();
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  if (timer === null) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      for (const listener of listeners) listener();
    }, 1000);
  }

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export const clock = {
  subscribe,
  getSnapshot: () => now,
  getServerSnapshot: (): number | null => null,
};
