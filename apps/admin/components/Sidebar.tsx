"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/properties", label: "Properties" },
  { href: "/orders", label: "Orders" },
  { href: "/tickets", label: "Tickets" },
  { href: "/users", label: "Users" },
  { href: "/roles", label: "Roles" },
  { href: "/categories", label: "Categories" }
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-semibold">IDGM Admin</div>
      <nav className="px-2 pb-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                `block rounded px-3 py-2 text-sm hover:bg-gray-100 ${active ? "bg-gray-100 font-medium" : "text-gray-700"}`
              }
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
