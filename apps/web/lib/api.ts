export function apiUrl(path: string) {
  // Absolute URLs pass through
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  // On the client, always use same-origin to avoid CORS
  if (typeof window !== 'undefined') return p
  // On the server, prepend external API base if provided
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  return base ? `${base}${p}` : p
}
