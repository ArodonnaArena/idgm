import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@idgm/lib'],
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  experimental: {
    // Include monorepo packages in build tracing
    outputFileTracingRoot: path.join(process.cwd(), '../../'),
  },
}

export default nextConfig
