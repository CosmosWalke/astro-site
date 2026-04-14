/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Set to false and fix type errors
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js image optimization (WebP/AVIF auto-conversion)
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  allowedDevOrigins: ['192.168.0.25', 'localhost', '127.0.0.1'],
}

export default nextConfig
