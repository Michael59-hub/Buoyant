# Buoyant

> A full-stack marketplace for buying and selling digital products â€” templates, books, tools, wallpapers, and assets. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

**Live demo â†’ [buoyant.vercel.app](https://buoyant.vercel.app)**

---

## What it does

Buoyant lets creators list digital products for sale and buyers purchase and download them instantly. Think of it as a lightweight Gumroad â€” built from scratch.

- Browse and search a catalogue of 500+ digital products
- Create an account, log in, and manage your orders
- Purchase products and get instant access
- Sellers can list their own digital items with images and pricing
- Images are stored and served via Cloudinary

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Image storage | Cloudinary |
| Deployment | Vercel |
| Styling | Tailwind CSS |

---

## Features

- **Authentication** â€” Custom sign up / sign in with session management
- **Product catalogue** â€” Browse all products, view by category, most popular, and newest
- **Product detail pages** â€” Images, descriptions, pricing, and purchase flow
- **Order management** â€” Users can view their order history at `/orders`
- **Image uploads** â€” Cloudinary integration with compression to minimise storage costs
- **Database seeding** â€” Seeding script (`scripts.js`) to populate the database with initial product data
- **Type-safe codebase** â€” End-to-end TypeScript with Prisma-generated types

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted e.g. Supabase, Neon)
- Cloudinary account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/Michael59-hub/Buoyant.git
cd Buoyant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your DATABASE_URL, CLOUDINARY_* keys, and NEXTAUTH_SECRET
```

### Database setup

```bash
# Run migrations
npx prisma migrate dev

# Seed the database with sample products
node scripts.js
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
Buoyant/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/          # Next.js App Router pages and API routes
â”‚   â””â”€â”€ components/   # Reusable UI components
â”œâ”€â”€ prisma/
â”‚   â””â”€â”€ schema.prisma # Database schema
â”œâ”€â”€ public/           # Static assets
â”œâ”€â”€ scripts.js        # Database seeding script
â””â”€â”€ generated/        # Prisma client (auto-generated)
```

---

## Database schema

The core data models are:

- **User** â€” accounts, authentication
- **Product** â€” title, description, price, image, availability
- **Order** â€” links users to purchased products

Schema defined in `prisma/schema.prisma`.

---

## What I learned building this

- Designing a relational schema with Prisma ORM and PostgreSQL from scratch
- Next.js App Router architecture â€” server components, client components, and API routes
- Cloudinary integration for image upload and optimisation
- Full TypeScript discipline across the entire stack
- Deploying a Next.js + PostgreSQL app to Vercel with environment variable management

---

## Author

**Michael Okoronkwo** â€” Backend Engineer  
[GitHub](https://github.com/Michael59-hub) Â· [LinkedIn](https://www.linkedin.com/in/michael-okoronkwo-520969202)
