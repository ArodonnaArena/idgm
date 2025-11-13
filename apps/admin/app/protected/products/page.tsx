"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@idgm/lib"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      setError("")
      const data: any = await api.products.list({ search: search || undefined })
      setProducts(data.products || [])
    } catch (err: any) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await api.products.delete(id)
      await loadProducts()
    } catch (err: any) {
      alert(err.message || "Failed to delete product")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/protected/products/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          onClick={loadProducts}
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
        <div className="py-12 text-center text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="rounded border bg-white p-12 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-gray-500">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ₦{p.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.inventory?.quantity ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        p.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Link
                      href={`/protected/products/${p.id}/edit`}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
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
        {products.length} product{products.length !== 1 ? "s" : ""} found
      </div>
    </div>
  )
}
