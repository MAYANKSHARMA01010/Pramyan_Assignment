/** @type {import('next').NextConfig} */
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_NODE_ENV === 'production' ||
  Boolean(process.env.VERCEL);

const rawBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (isProduction
    ? process.env.NEXT_PUBLIC_HOSTED_BACKEND_URL || 'https://pramyan-assignment.onrender.com'
    : process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || 'http://localhost:5001');

const backendUrl = rawBackendUrl.replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

