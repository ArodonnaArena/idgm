import { prisma } from '../../lib/prisma'
import Link from 'next/link'

export default async function EstateList() {
  const properties = await prisma.property.findMany({ include: { images: true, units: true }, orderBy: { createdAt: 'desc' } })
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map(p => (
          <Link key={p.id} href={`/estate/${p.slug}`} className="border rounded bg-white hover:shadow">
            <div className="p-4">
              <div className="aspect-video bg-gray-100 mb-2" style={{backgroundImage:`url(${p.images[0]?.url||''})`, backgroundSize:'cover'}} />
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">{p.city}, {p.state}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}