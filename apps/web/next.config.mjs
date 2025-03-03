/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "suvfsyxqzj.ufs.sh" }],
  },
  transpilePackages: ["@workspace/ui"],
};

export default nextConfig;
