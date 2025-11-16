import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import { normalizeImageUrl } from '../../../lib/images'

interface Params { params: { slug: string } }

export default async function ProductPage({ params }: Params) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true } })
  if (!product) return notFound()
  const imageUrl = normalizeImageUrl(product.images[0]?.url)
  const altText = product.images[0]?.alt || product.name
  return (
    <main className="p-8 grid md:grid-cols-2 gap-8">
      <div>
        <img src={imageUrl} alt={altText} className="rounded border" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-700 mt-2">₦{Number(product.price).toLocaleString()}</p>
        {product.description && <p className="mt-4 text-gray-600">{product.description}</p>}
      </div>
    </main>
  )
}