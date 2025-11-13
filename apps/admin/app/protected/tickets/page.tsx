import { prisma } from "@idgm/lib"

export default async function TicketsPage() {
  const items = await prisma.maintenanceTicket.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { author: true, unit: true }
  })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tickets</h1>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">{t.priority}</td>
                <td className="px-4 py-2">{t.author?.email}</td>
                <td className="px-4 py-2">{t.unit?.label ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
