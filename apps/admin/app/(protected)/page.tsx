import { prisma } from "@idgm/lib"

export default async function Page() {
  const items = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { roles: { include: { role: true } } }
  })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Recently added users</h1>
      <ul className="divide-y rounded border bg-white">
        {items.map((u) => (
          <li key={u.id} className="px-4 py-3 text-sm">
            <div className="font-medium">{u.email}</div>
            <div className="text-gray-600">{u.roles.map(r => r.role.name).join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
