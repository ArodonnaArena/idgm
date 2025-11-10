let PrismaPlugin
try {
  ({ PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin'))
} catch (e) {
  // Optional in hosted builds; continue without the plugin
  PrismaPlugin = class { apply() {} }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@prisma/client'],
  experimental: {
    // Server actions are now stable and enabled by default
  },
  images: {
    unoptimized: false,
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  }
}
module.exports = nextConfig
