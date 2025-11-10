"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-black"
    >
      Sign out
    </button>
  )
}
