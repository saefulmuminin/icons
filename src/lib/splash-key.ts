/**
 * The name the splash remembers itself by.
 *
 * Read by the component that sets it and by the guard in
 * `public/splash-guard.js` that reads it before paint. The guard cannot import
 * from here — it runs as a plain file ahead of any bundle — so a unit test
 * holds the two together.
 */
export const SPLASH_SEEN = "iconz-splash";
