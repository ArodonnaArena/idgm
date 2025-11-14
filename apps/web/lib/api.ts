export function apiUrl(path: string) {
  // Absolute URLs pass through
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`

  // Next.js API routes: always use same-origin relative paths
  // This works both on the server (App Router/SSR) and on the client.
  if (p.startsWith('/api/')) {
    return p
  }

  // For backend routes (auth, products, etc.), use external API
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  return base ? `${base}${p}` : p
}
