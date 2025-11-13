import { prisma } from "@idgm/lib"

export default async function RolesPage() {
  const items = await prisma.role.findMany({
    take: 50,
    orderBy: { name: "asc" },
    include: { permissions: true }
  })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Roles</h1>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.permissions.map(p => p.action).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
