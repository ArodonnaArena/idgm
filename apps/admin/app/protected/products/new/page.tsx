"use client"

import { useEffect, useMemo, useState } from "react"
import { api, API_BASE } from "@idgm/lib"

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_BASE}/upload/image`, { method: "POST", body: form })
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return data.url as string
}

export default function NewProductPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState(0)
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setSlug(slugify(name))
  }, [name])

  useEffect(() => {
    api.categories.list().then((data: any) => setCategories(Array.isArray(data) ? data : []))
  }, [])

  const canSubmit = useMemo(() => name && slug && sku && price >= 0 && categoryId, [name, slug, sku, price, categoryId])

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage(file)
      setImages((prev) => [...prev, { url }])
    } catch (e: any) {
      alert(e.message || "Image upload failed")
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      await api.products.create({ name, slug, sku, price: Number(price), categoryId, description, isActive, images })
      window.location.href = "/products"
    } catch (e: any) {
      setError(e.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Slug</label>
            <input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">SKU</label>
            <input className="mt-1 w-full rounded border px-3 py-2 text-sm" value={sku} onChange={(e) => setSku(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Price (NGN)</label>
            <input type="number" className="mt-1 w-full rounded border px-3 py-2 text-sm" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Category</label>
            <select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Active</label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Description</label>
          <textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Images</label>
          <input type="file" accept="image/*" onChange={onFileChange} className="mt-1 text-sm" />
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <img key={i} src={img.url} alt="preview" className="h-16 w-16 rounded object-cover" />
            ))}
          </div>
        </div>
        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <div>
          <button type="submit" disabled={!canSubmit || loading} className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
