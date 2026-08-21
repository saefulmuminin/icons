import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route lives under `[lang]`, so an address that matches no language
  // has no layout to render a 404 inside. This hands those to
  // `app/global-not-found.tsx`, which builds its own document.
  experimental: { globalNotFound: true },

  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
