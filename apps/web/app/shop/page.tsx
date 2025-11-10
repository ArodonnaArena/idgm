import { redirect } from 'next/navigation'

export default function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const qs = searchParams?.category ? `?category=${encodeURIComponent(searchParams.category)}` : ''
  redirect(`/shop/products${qs}`)
}
