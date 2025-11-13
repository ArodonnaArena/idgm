"use client"

import { useEffect, useState } from "react"
import { api } from "@idgm/lib"

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"] as const

type Status = typeof STATUSES[number]

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<Status | "">("")

  useEffect(() => {
    load()
  }, [status])

  async function load() {
    try {
      setLoading(true)
      setError("")
      const data: any = await api.orders.list({ status: status || undefined })
      setOrders(data.orders || [])
    } catch (e: any) {
      setError(e.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, s: Status) {
    try {
      await api.orders.updateStatus(id, s)
      await load()
    } catch (e: any) {
      alert(e.message || "Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | "")}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded border bg-white p-12 text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2 font-mono">{o.id.slice(-6)}</td>
                  <td className="px-4 py-2">{o.user?.email || "—"}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">₦{o.total?.toLocaleString?.() ?? o.total}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(o.id, "PAID")}
                        className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => updateStatus(o.id, "FULFILLED")}
                        className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Mark Fulfilled
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
