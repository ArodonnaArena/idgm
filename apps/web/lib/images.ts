export function normalizeImageUrl(url?: string | null): string {
  if (!url) return ''

  // If already https and not pointing at localhost, just return it
  if (url.startsWith('https://') && !url.includes('localhost')) {
    return url
  }

  // If it's an http URL (likely localhost from backend), swap the origin to NEXT_PUBLIC_BACKEND_URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const backendBase = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
      if (!backendBase) return url

      const original = new URL(url)
      const pathAndQuery = original.pathname + original.search
      return `${backendBase}${pathAndQuery}`
    } catch {
      return url
    }
  }

  // Relative path like /uploads/xyz.jpg – prefix with backend URL if available
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
  if (backendBase) {
    const path = url.startsWith('/') ? url : `/${url}`
    return `${backendBase}${path}`
  }

  return url
}
