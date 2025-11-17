"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
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

export default function EditProductPage() {
  const params = useParams() as { id?: string }
  const productId = params?.id as string | undefined

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState(0)
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [hasFreeShipping, setHasFreeShipping] = useState(false)
  const [stock, setStock] = useState(0)
  const [threshold, setThreshold] = useState(0)
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setSlug(slugify(name))
  }, [name])

  // Load categories and product details
  useEffect(() => {
    api.categories.list().then((data: any) => setCategories(Array.isArray(data) ? data : []))

    async function loadProduct() {
      if (!productId) return
      try {
        setLoading(true)
        setError("")
        const p: any = await api.products.get(productId)
        setName(p.name || "")
        setSlug(p.slug || "")
        setSku(p.sku || "")
        setPrice(Number(p.price) || 0)
        setCategoryId(p.categoryId || "")
        setDescription(p.description || "")
        setIsActive(p.isActive ?? true)
        setHasFreeShipping(p.hasFreeShipping ?? false)
        setStock(p.inventory?.quantity ?? 0)
        setThreshold(p.inventory?.threshold ?? 0)
        setImages((p.images || []).map((img: any) => ({ url: img.url, alt: img.alt })))
      } catch (e: any) {
        setError(e.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const canSubmit = useMemo(
    () => !!(productId && name && slug && sku && price >= 0 && categoryId),
    [productId, name, slug, sku, price, categoryId]
  )

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

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!productId) return
    try {
      setSaving(true)
      setError("")
      console.log('[EditProduct] Submitting update', { productId, imagesCount: images.length, hasFreeShipping })
      await api.products.update(productId, {
        name,
        slug,
        sku,
        price: Number(price),
        categoryId,
        description,
        isActive,
        hasFreeShipping,
        images,
        inventory: {
          quantity: stock,
          threshold,
        },
      })
      window.location.href = "/protected/products"
    } catch (e: any) {
      let message = e?.message || "Failed to update product"
      const data = e?.data
      if (data) {
        if (typeof data === "string") {
          message += `: ${data}`
        } else if (Array.isArray(data?.message)) {
          message += `: ${data.message.join(", ")}`
        } else if (data?.message) {
          message += `: ${data.message}`
        } else if (data?.error) {
          message += `: ${data.error}`
        }
      }
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading product...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
            <label className="block text-sm text-gray-700">SKU</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Price (NGN)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Stock (quantity)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={stock}
              min={0}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Low-stock threshold</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={threshold}
              min={0}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Category</label>
            <select
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
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
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-2 mr-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Free Shipping</label>
            <input
              type="checkbox"
              checked={hasFreeShipping}
              onChange={(e) => setHasFreeShipping(e.target.checked)}
              className="mt-2 mr-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Description</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
        )}
        <div>
          <button
            type="submit"
            onClick={onSubmit}
            disabled={!canSubmit || saving}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
