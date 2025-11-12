export function apiUrl(path: string) {
  // Absolute URLs pass through
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  // Use external API base if provided (for both client and server)
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  return base ? `${base}${p}` : p
}
