import { prisma } from "@idgm/lib"

export default async function PropertiesPage() {
  const items = await prisma.property.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { landlord: { include: { user: true } } }
  })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Properties</h1>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">{p.type}</td>
                <td className="px-4 py-2">{p.city}</td>
                <td className="px-4 py-2">{p.state}</td>
                <td className="px-4 py-2">{p.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
