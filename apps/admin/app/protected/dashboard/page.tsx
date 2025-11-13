import { prisma } from "@idgm/lib"

async function getCounts() {
  const [users, products, properties, orders, tickets] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.property.count(),
    prisma.order.count(),
    prisma.maintenanceTicket.count()
  ])
  return { users, products, properties, orders, tickets }
}

export default async function DashboardPage() {
  const c = await getCounts()
  const cards = [
    { label: "Users", value: c.users },
    { label: "Products", value: c.products },
    { label: "Properties", value: c.properties },
    { label: "Orders", value: c.orders },
    { label: "Tickets", value: c.tickets }
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((k) => (
          <div key={k.label} className="rounded border bg-white p-4">
            <div className="text-sm text-gray-600">{k.label}</div>
            <div className="mt-2 text-2xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
