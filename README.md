# Rukshaa — Website

Storefront + admin panel for Rukshaa, built with Next.js and Supabase.
Customers browse products and "checkout" opens WhatsApp with their order
pre-filled — there's no payment gateway involved. Products are managed
from a password-protected `/admin` panel.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign up, and create a new project (free tier is enough to start).
2. Once it's ready, open **SQL Editor** in the left sidebar, paste in the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `products` table and the `product-images` storage bucket.
3. Open **Project Settings -> API**. You'll need three values from this page:
   - `Project URL`
   - `anon` `public` key
   - `service_role` key (click "reveal" — keep this secret)

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` (already done for you — just edit `.env.local`) and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=          # Project URL from step 1
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # anon public key
SUPABASE_SERVICE_ROLE_KEY=         # service_role key — keep secret

ADMIN_PASSWORD=                    # password to log into /admin
ADMIN_SESSION_SECRET=              # any long random string

NEXT_PUBLIC_WHATSAPP_NUMBER=919550890351   # already set
NEXT_PUBLIC_SITE_NAME=Rukshaa
```

`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are currently placeholders
(`change-me...`) — pick your own values before putting this live.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront,
and [http://localhost:3000/admin](http://localhost:3000/admin) to add
products (log in with the `ADMIN_PASSWORD` you set above).

Until products are added, the site will say Supabase isn't configured
(if env vars are missing) or just show empty categories (once configured
but no products yet) — that's expected.

## 4. Adding products

From `/admin`:
1. Click **Add Product**.
2. Fill in name, description, price, category, sizes (optional, comma
   separated, e.g. `S, M, L, XL`), and upload photos.
3. Save — it appears on the storefront immediately.

## 5. How checkout works

There's no online payment. A customer adds items to their cart, goes to
`/checkout`, fills in name/phone/address, and clicking "Send Order via
WhatsApp" opens a WhatsApp chat to **+91 95508 90351** with the order
details and total pre-filled as the message. You confirm price, sizing,
and payment directly with the customer over WhatsApp, matching how the
Instagram-based ordering already works.

To change the receiving number later, update `NEXT_PUBLIC_WHATSAPP_NUMBER`
in `.env.local` (and in your hosting provider's environment variables).

## 6. Deploying (Vercel)

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings (Settings -> Environment Variables).
4. Deploy. You'll get a free `*.vercel.app` URL; a custom domain can be
   added later under Settings -> Domains.

## Project structure

- `src/app` — pages (storefront + admin), following Next.js App Router conventions.
- `src/app/admin/actions.ts` — server actions for creating/updating/deleting products and uploading images (uses the Supabase service role key; never exposed to the browser).
- `src/lib/cart-context.tsx` — cart state, persisted to `localStorage`.
- `src/lib/whatsapp.ts` — builds the order message and `wa.me` checkout link.
- `src/middleware.ts` — protects `/admin` and `/api/admin` routes behind the admin password.
- `supabase/schema.sql` — database schema to run once in Supabase's SQL editor.
