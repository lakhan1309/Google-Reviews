# QR Review Assistant

AI-powered Google review assistant. Customers scan a QR code at your business counter, pick a star rating, choose from AI-generated review options, and are redirected to Google to paste and submit.

## Features

- **Customer flow**: Star rating → 3 AI-generated reviews → copy → redirect to Google
- **Admin dashboard**: Manage businesses, download QR codes, view analytics
- **QR codes**: Auto-generated per business, ready to print
- **PostgreSQL (Neon)**: Persistent storage for Vercel and production

## Prerequisites

- Node.js 20+
- Neon PostgreSQL database ([neon.tech](https://neon.tech))
- OpenAI API key (production)

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Fill in:
   - `DATABASE_URL` — Neon connection string
   - `OPENAI_API_KEY` — optional locally if `USE_MOCK_REVIEWS=true`
   - `AUTH_SECRET` — run `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login credentials
   - `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`

3. **Run migrations and seed**

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   - Home: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Sample review page: http://localhost:3000/r/joes-pizza

## Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment with Neon"
   git push -u origin main
   ```

2. **Import project** at [vercel.com/new](https://vercel.com/new)

3. **Add Neon database** — Vercel Dashboard → Storage → Create → Neon Postgres → link to project (sets `DATABASE_URL` automatically)

4. **Set environment variables** in Vercel Project Settings:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Auto-set by Neon integration |
   | `OPENAI_API_KEY` | Your OpenAI API key |
   | `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
   | `ADMIN_EMAIL` | Your admin email |
   | `ADMIN_PASSWORD` | Strong password |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

   Do **not** set `USE_MOCK_REVIEWS` on Vercel (mock reviews are disabled in production automatically).

5. **Deploy** — Vercel runs `npm run build` (includes `prisma generate`)

6. **Run migrations** against your Neon database (one-time):

   ```bash
   DATABASE_URL="your-neon-url" npm run db:deploy
   DATABASE_URL="your-neon-url" npm run db:seed
   ```

7. **Redeploy** after setting `NEXT_PUBLIC_APP_URL` to your live Vercel URL so QR codes point to production.

## Google Place ID

1. Open your business on [Google Maps](https://maps.google.com)
2. Use the [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
3. Paste the Place ID when creating a business in the admin dashboard

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed sample business |
| `npm run db:import` | Import businesses from `data/businesses.json` |
