"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@idgm/lib"

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [parentId, setParentId] = useState("")

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    setSlug(slugify(name))
  }, [name])

  async function load() {
    try {
      setLoading(true)
      setError("")
      const data: any = await api.categories.list()
      setCategories(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.categories.create({ name, slug, parentId: parentId || undefined })
      setName("")
      setSlug("")
      setParentId("")
      await load()
    } catch (e: any) {
      alert(e.message || "Failed to create category")
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return
    try {
      await api.categories.delete(id)
      await load()
    } catch (e: any) {
      alert(e.message || "Failed to delete category")
    }
  }

  const parentOptions = useMemo(
    () => categories.map((c: any) => ({ id: c.id, name: c.name })),
    [categories]
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <form onSubmit={createCategory} className="rounded border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Slug</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Parent</label>
            <select
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">None</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-sm text-white">
            Add Category
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Parent</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.slug}</td>
                  <td className="px-4 py-2">{c.parent?.name ?? "-"}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => remove(c.id)}
                      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
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
    </div>
  )
}
