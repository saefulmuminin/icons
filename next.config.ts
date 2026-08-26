import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles the server and only the files it actually needs into
  // `.next/standalone`, so the runtime image carries no build tooling and no
  // node_modules tree. Without this the container is an order of magnitude
  // larger for no gain.
  output: "standalone",

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
