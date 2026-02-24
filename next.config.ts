import type { NextConfig } from "next";

// We define our own type that includes the 'turbopack' key
// at the ROOT level to satisfy both the engine and TypeScript.
interface Next16Config extends NextConfig {
  turbopack?: Record<string, unknown>;
}

const nextConfig: Next16Config = {
  output: "export",
  images: { unoptimized: true },

  // MOVE THIS OUT OF EXPERIMENTAL
  // This is the key that silences the "webpack config detected" error
  turbopack: {},

  webpack: (config) => {
    if (config.resolve) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
