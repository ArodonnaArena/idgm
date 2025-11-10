"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@idgm/lib"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      setError("")
      const data: any = await api.users.list({ search: search || undefined })
      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await api.users.delete(id)
      await loadUsers()
    } catch (err: any) {
      alert(err.message || "Failed to delete user")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link
          href="/users/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          onClick={loadUsers}
          className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="rounded border bg-white p-12 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Roles
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{u.name || "—"}</div>
                    <div className="text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {Array.isArray(u.roles) ? u.roles.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/users/${u.id}/edit`}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-gray-600">
        {users.length} user{users.length !== 1 ? "s" : ""} found
      </div>
    </div>
  )
}
