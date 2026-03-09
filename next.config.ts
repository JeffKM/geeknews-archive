import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // puppeteer-core, @sparticuz/chromium은 네이티브 바이너리 포함 → 번들링 제외
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // @ts-expect-error - Next.js 타입 정의 누락, 런타임에 지원됨 (Vercel 배포 시 chromium 바이너리 포함)
    outputFileTracingIncludes: {
      '/api/invoice/[id]/pdf': ['./node_modules/@sparticuz/chromium/**/*'],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
