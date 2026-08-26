/**
 * Whether decorative motion should stay parked: true when the reader asks for
 * reduced motion, or when the browser reports a metered connection.
 *
 * Exposed as an external store so components read it through
 * `useSyncExternalStore` instead of flipping state inside an effect.
 * `getServerSnapshot` returns true, so prerendered markup never carries the
 * player and it is attached only once the client takes over.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  const { connection } = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };

  return window.matchMedia(QUERY).matches || connection?.saveData === true;
}

export const stillness = {
  subscribe,
  getSnapshot,
  getServerSnapshot: () => true,
};
