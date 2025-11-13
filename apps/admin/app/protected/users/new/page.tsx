"use client"

import { useState } from "react"
import { api } from "@idgm/lib"

export default function NewUserPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">("ACTIVE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      await api.users.create({ email, password, name, phone, status })
      window.location.href = "/users"
    } catch (e: any) {
      setError(e?.data?.message || e.message || "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add User</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Phone</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Status</label>
            <select
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
        )}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  )
}
