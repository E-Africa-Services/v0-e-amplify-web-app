/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live/ https://vercel.fides-cdn.ethyca.com/ https://cdn.jsdelivr.net/ https://va.vercel-scripts.com/",
              "style-src 'self' 'unsafe-inline' https://vercel.live/ https://vercel.fides-cdn.ethyca.com/ https://fonts.googleapis.com/ https://cdn.jsdelivr.net/",
              "font-src 'self' data: https://fonts.gstatic.com/ https://cdn.jsdelivr.net/",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live/ https://vercel.fides-cdn.ethyca.com/ https://vitals.vercel-insights.com/ https://va.vercel-scripts.com/",
              "frame-src 'self' https://vercel.live/",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
