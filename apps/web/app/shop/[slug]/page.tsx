import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'

interface Params { params: { slug: string } }

export default async function ProductPage({ params }: Params) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true } })
  if (!product) return notFound()
  return (
    <main className="p-8 grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.images[0]?.url} alt={product.images[0]?.alt||product.name} className="rounded border" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-700 mt-2">₦{Number(product.price).toLocaleString()}</p>
        {product.description && <p className="mt-4 text-gray-600">{product.description}</p>}
      </div>
    </main>
  )
}