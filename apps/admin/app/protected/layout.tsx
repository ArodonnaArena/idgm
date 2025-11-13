import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@idgm/lib"
import { redirect } from "next/navigation"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import AuthTokenProvider from "../../components/AuthTokenProvider"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const roles: string[] = ((session.user as any)?.roles ?? []) as string[]
  const allowed = roles.includes("ADMIN") || roles.includes("STAFF")
  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-gray-600">Your account does not have access to the admin area.</p>
      </div>
    )
  }
  const token: string | null = (session as any).accessToken || null
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header session={session} />
        {/* Hydrate API client with bearer token on the client */}
        <AuthTokenProvider token={token} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
