/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: process.env.SOCKET_URL || "http://127.0.0.1:5000",
  },
};

export default nextConfig;
