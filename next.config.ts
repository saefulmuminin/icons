import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone only when building the container: it bundles the server and
  // just the files it needs into `.next/standalone`, so the image carries no
  // build tooling and no node_modules tree.
  //
  // It must stay off everywhere else. Vercel traces the build its own way and
  // looks for `next-server.js.nft.json`, which standalone does not write — the
  // deploy then fails at the very last step, after a build that reported
  // success.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,

  // Every route lives under `[lang]`, so an address that matches no language
  // has no layout to render a 404 inside. This hands those to
  // `app/global-not-found.tsx`, which builds its own document.
  experimental: {
    globalNotFound: true,

    // Turbopack keeps a filesystem cache for builds under `.next/cache`, on by
    // default since 16.3.0. That is the one directory Vercel restores between
    // deploys, and the cache is a self-referencing database: a build compacts
    // it, renumbering its .sst segments and rewriting the manifest that names
    // them. Restore a manifest from one generation beside segments from
    // another and the build does not fall back to a cold compile — it dies
    // reading a segment that no longer exists:
    //
    //   Unable to open static sorted file referenced from 00000011.meta
    //   failed to open .../00000006.sst: No such file or directory
    //
    // A cold build here takes under thirty seconds, so the cache was buying
    // very little and costing every deploy. Off until the upstream cache
    // learns to rebuild itself instead of crashing.
    turbopackFileSystemCacheForBuild: false,
  },

  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      // The call for papers grew a second call and became "Submission". The
      // old address is on posters and in search results, so it is kept alive
      // rather than left to 404.
      {
        source: "/:lang/call-for-paper",
        destination: "/:lang/submission",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
