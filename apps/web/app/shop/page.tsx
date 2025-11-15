import { redirect } from 'next/navigation'

export default function ShopPage({ searchParams }: { searchParams: { category?: string; debug?: string } }) {
  const params = new URLSearchParams()
  if (searchParams?.category) params.set('category', searchParams.category)
  if (searchParams?.debug === '1') params.set('debug', '1')
  const qs = params.toString() ? `?${params.toString()}` : ''
  redirect(`/shop/products${qs}`)
}
