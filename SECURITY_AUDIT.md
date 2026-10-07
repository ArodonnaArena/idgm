# Security Compliance Audit

## Scope and status

The repository was audited against the seven requested controls. This audit is intentionally source-grounded and does not claim remote Supabase enforcement where the project schema must be deployed separately.

| Control | Status | Evidence / blocker |
|---|---|---|
| Secrets | Partial | Secret names are present, but browser exposure must be audited. Live local values were not printed. No committed credential values were found in Git history, but current local environment files still require rotation through the providers. |
| Ownership | Not compliant | Many Next.js API routes have no authenticated session check. `userId` in request bodies/queries is trusted in multiple routes. |
| Database rules | Not compliant | Only `users`, `products`, and `orders` have RLS enabled in the schema; most public tables have no policies. |
| Mass assignment | Partial | Only payment registration and registration routes use Zod; most request bodies are parsed without a strict schema. |
| Payments | Not compliant | Checkout sends client `amount` and `price`; payment initialization trusts those values and stores an email as a user ID. |
| Rate limits | Not compliant | No route-specific rate limits are present for login, registration, password reset, or paid API calls. |
| Prove it | Not compliant | No cross-user test exists. A test harness was added but requires a deployed Supabase project and authenticated users. |

## Environment variables

All runtime variable names found in source, omitted values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `PAYSTACK_SECRET_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `CLOUDINARY_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### Browser exposure

The values that must not be browser-visible are:

- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `CLOUDINARY_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`

The following may be public only when deliberately used by client code:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The current application still imports several values into client-facing modules. They must be split into server-only variables and the public URL configuration must be explicit.

### Rotation

No credential value was found in Git history. Current local `.env` files are ignored by the repository, but any credential that has ever been copied into a public repository or pasted into chat/issue must be rotated. Required provider actions:

1. Revoke current values.
2. Create a new key and update the deployment secret store.
3. Remove local values from `.env` and `.env.local` after rotating.
4. Ensure the new values are not included in `git add`, commits, logs, screenshots, or deployment artifacts.

## API route ownership audit

### Next.js route handlers

- `GET /api/products`: public read; no resource ownership required.
- `GET /api/products/[slug]`: public read; no resource ownership required.
- `GET /api/properties`: public read; no resource ownership required.
- `GET /api/properties/[slug]`: public read; no resource ownership required.
- `GET /api/homepage`: public read; no resource ownership required.
- `POST /api/register`: public registration; no existing resource ID.
- `POST /api/auth/[...nextauth]`: authentication route; no resource ownership.
- `POST /api/payments/initialize`: authenticated route after the current hardening; must not accept price/amount from the client.
- `POST /api/webhooks/paystack`: signed webhook; no caller session is expected.
- `GET/POST/PUT/DELETE /api/cart`: authenticated cart ownership; currently session is checked, but cart item ownership must be verified by the backend.
- `POST /api/cart/apply-coupon`: authenticated route; coupon ownership is not required; coupon is a shared policy.
- `GET /api/dashboard`: authenticated user data; must use the authenticated user ID.
- `GET /api/admin/*`: administrative routes; must verify role from session and owner/resource checks.
- `GET /api/admin/users`: administrative route; currently accepts a user ID from the body for PATCH and does not verify caller role.

### NestJS route handlers

- `GET /api/products`: public read.
- `GET /api/products/:id`: public read.
- `GET /api/products/slug/:slug`: public read.
- `POST /api/products`: admin/staff; role guard present.
- `PUT /api/products/:id`: admin/staff; role guard present, but resource ownership is not needed for global products.
- `DELETE /api/products/:id`: admin; role guard present.
- `POST /api/products/:id/inventory`: admin/staff; role guard present.
- `GET/POST/PUT/DELETE /api/cart`: authenticated user; the controller derives the user from the JWT.
- `GET /api/orders`: current route accepts `userId` as a query parameter and does not inherit the authenticated user ID.
- `GET /api/orders/:id`: current route does not verify owner or admin role.
- `POST /api/orders`: role guard allows ADMIN/STAFF, but the DTO accepts `userId` and client prices.
- `PUT /api/orders/:id/status`: admin/staff; role guard present, but should verify the order belongs to the current user when called by a normal user.
- `GET /api/users/:id`: admin/staff; role guard present but no per-resource check.
- `POST/PUT/DELETE /api/users`: admin/staff; role guard present, but caller role and target ID must be checked.
- `POST /api/auth/register`, `POST /api/auth/login`: public authentication endpoints; no target resource ID.

## Ownership verdict

The following routes currently trust a caller-controlled resource ID or user ID:

- `POST /api/admin/users` accepts `userId` from the body and updates that user without authenticating the caller.
- `GET /api/orders?userId=...` accepts a target user ID.
- `POST /api/orders` accepts `userId` from the body and client prices.
- `GET /api/orders/:id` returns any order by ID without owner verification.
- `GET /api/admin/*` routes must be Protected by `getServerSession` and role checks; current availability is not sufficient.

The required invariant is: every resource-changing route must derive owner from `auth.uid()` or an authenticated session; every read route must derive the owner from the session or enforce an admin role.

## Database RLS status

The schema currently enables RLS only on `users`, `products`, and `orders`. The remaining public tables are not covered by a complete policy set.

The required migration is in `supabase/rls-policies.sql` and must be applied to the configured Supabase project before claiming protection. It must include:

- Public read-only access for products/categories/properties where appropriate.
- User-owned access for carts, cart items, orders, order items, addresses, wishlist items, payments, maintenance tickets, and account/session tables.
- Admin-only access for roles, permissions, user roles, and management tables.
- `with check (auth.uid() = user_id)` for inserts and `using (auth.uid() = user_id)` for reads.
- No RLS policy that trusts a request body or query parameter.

## Mass assignment

The following bodies have strict validation status:

- Registration: Zod schema, but only validates root fields and does not include strict unknown-field rejection.
- Payment initialization: newly strict; accepts only `provider` and `items` and rejects unknown fields.
- Admin product creation: manual required-field check; does not reject unknown fields.
- Admin property creation: manual handling; does not reject unknown fields.
- Admin users update: manual payload; accepts `userId`, `status`, and `roleIds` without authorization.
- Order creation: class-validator DTO, but `userId` and `price` are client-controlled.

The fields a user must never set are:

- `id`
- `userId` or `ownerId`
- `roleIds` when the caller is not an administrator
- `price`, `amount`, `total`, `status`, and `createdAt` unless the caller is authorized to change those fields
- `paymentStatus`, `providerReference`, `inventoryQuantity`, and any audit timestamp

## Payments

The current checkout computes `total` in the browser and sends it as `amount`; the backend route also accepts `price` in order items. The hardened server route now:

1. Requires an authenticated session.
2. Accepts only `provider` and `items`.
3. Loads products from Supabase with product IDs.
4. Calculates total from `product.price * quantity` on the server.
5. Store the calculated amount only in the payment record.
6. Sends the calculated amount to the payment provider.

The Paystack webhook must verify `x-paystack-signature` against `PAYSTACK_SECRET_KEY` using the raw request bytes before processing any event. The current webhook implementation verifies the signature, but the route still needs a real authentication/ownership check and a server-side order record binding.

## Rate limits

The repository currently has no route-specific rate limiter. The required limits are:

- `POST /api/register`: 5 requests per IP per 5 minutes.
- `POST /api/auth/[...nextauth]`: 20 requests per IP per 5 minutes.
- `POST /api/auth/reset-password`: 5 requests per IP per 15 minutes.
- `POST /api/payments/initialize`: 20 requests per authenticated user per minute.
- `POST /api/webhooks/paystack`: 100 requests per IP per minute, with signature validation first.
- Any route that calls a paid API: 10 requests per authenticated user per minute.

The response when exceeded is HTTP 429 with `Retry-After` and a JSON body containing `error: rate_limit_exceeded`.

## Cross-user proof

The test should work against a live Supabase project:

1. Create user A with a test record.
2. Create user B with an independent authenticated session.
3. User B attempts `select`, `update`, and `delete` on user A's record.
4. Every attempt must return HTTP 403 or 404.
5. The test must assert that no record is returned or changed.

The implementation is in `tests/cross-user-rls.test.mjs`. It cannot be executed against this repository without a configured Supabase project and authenticated sessions; the test must therefore be run in the target environment before shipping.
