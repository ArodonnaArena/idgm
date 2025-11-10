export function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) return path
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
