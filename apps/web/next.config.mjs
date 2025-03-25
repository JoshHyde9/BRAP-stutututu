/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "suvfsyxqzj.ufs.sh" },
      { hostname: "cdn.discordapp.com" },
    ],
  },
  transpilePackages: ["@workspace/ui"],
};

export default nextConfig;
