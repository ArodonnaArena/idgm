import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'

interface Params { params: { slug: string } }

export default async function PropertyPage({ params }: Params) {
  const property = await prisma.property.findUnique({ where: { slug: params.slug }, include: { images: true, units: true } })
  if (!property) return notFound()
  return (
    <main className="p-8 grid md:grid-cols-2 gap-8">
      <div>
        <img src={property.images[0]?.url} alt={property.images[0]?.alt||property.title} className="rounded border" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{property.title}</h1>
        <p className="text-gray-700 mt-2">{property.city}, {property.state}</p>
        {property.description && <p className="mt-4 text-gray-600">{property.description}</p>}
      </div>
    </main>
  )
}