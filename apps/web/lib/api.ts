export function apiUrl(path: string) {
  // Absolute URLs pass through
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  
  // On server-side (SSR/SSG), need absolute URL for fetch()
  // Check if we're on the server
  const isServer = typeof window === 'undefined'
  
  if (isServer) {
    // For Next.js API routes on server, construct absolute URL
    if (p.startsWith('/api/')) {
      // Use VERCEL_URL in production or localhost in dev
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      return `${baseUrl}${p}`
    }
  }
  
  // Client-side: Keep Next.js API routes as same-origin relative paths
  if (p.startsWith('/api/')) {
    return p
  }
  
  // For backend routes (auth, products, etc.), use external API
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  return base ? `${base}${p}` : p
}
