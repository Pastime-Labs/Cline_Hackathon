import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  agentRules: false,
  serverExternalPackages: ["@cline/sdk"],
};
export default nextConfig;
