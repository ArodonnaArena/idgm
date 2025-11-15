const BACKEND_ORIGIN = 'https://idgm-backend.onrender.com'

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return ''

  // If already https and not pointing at localhost, just return it
  if (url.startsWith('https://') && !url.includes('localhost')) {
    return url
  }

  // If it's an http/https URL from localhost or the backend host, normalize to the backend origin
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const original = new URL(url)
      const host = original.hostname
      const pathAndQuery = original.pathname + original.search
      if (host === 'localhost' || host === '127.0.0.1' || host === 'idgm-backend.onrender.com') {
        return `${BACKEND_ORIGIN}${pathAndQuery}`
      }
      // For other hosts (e.g. Unsplash) keep as-is
      return url
    } catch {
      return url
    }
  }

  // Relative path like /uploads/xyz.jpg – prefix with backend origin
  const path = url.startsWith('/') ? url : `/${url}`
  return `${BACKEND_ORIGIN}${path}`
}
