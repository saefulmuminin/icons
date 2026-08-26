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
  experimental: { globalNotFound: true },

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
