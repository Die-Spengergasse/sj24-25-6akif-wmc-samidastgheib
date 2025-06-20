/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['img.f-online.at'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.f-online.at',
      },
    ],
  },
}

module.exports = nextConfig 