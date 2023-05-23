/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: false,
  },
  swcMinify: true,
  images: {
    domains: ['gateway.pinata.cloud']
  }

}

module.exports = nextConfig
