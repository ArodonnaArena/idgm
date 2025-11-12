export function apiUrl(path: string) {
  // Absolute URLs pass through
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  
  // Keep Next.js API routes (/api/*) as same-origin
  if (p.startsWith('/api/')) {
    return p
  }
  
  // For backend routes (auth, products, etc.), use external API
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  return base ? `${base}${p}` : p
}
