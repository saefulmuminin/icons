/**
 * Delete Turbopack's build cache before the build runs.
 *
 * The config disables the cache, so nothing here should read it — but Vercel
 * restores `.next/cache` from its own store and re-uploads whatever it finds
 * afterwards. Left alone, the corrupt generation that broke the deploy would
 * be carried forward into every future build's restore, forever. Removing it
 * is what actually gets it out of the platform's cache.
 *
 * Safe to run when the directory is not there, which is the usual case.
 */
import { rmSync } from "node:fs";

// Only the build cache. `.next/dev` belongs to the dev server, is never
// restored by the platform, and wiping it here would just make the next
// `next dev` on someone's laptop start cold for no reason.
rmSync(".next/cache/turbopack", { recursive: true, force: true });
