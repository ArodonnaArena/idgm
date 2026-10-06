/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@idgm/lib'],
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
}
module.exports = nextConfig
