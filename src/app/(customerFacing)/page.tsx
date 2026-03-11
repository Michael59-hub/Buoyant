import { prisma } from "@/db/db"
import ProductsCard from "@/components/ProductsCard"
import Link from "next/link"

export default async function HomePage() {
  const popularProducts = await getMostPopularProducts()
  const newestProducts = await getNewestProducts()

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-36">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c8f53320] blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#c8f533] animate-pulse" />
            <span className="text-xs text-white/50 font-mono tracking-[0.2em] uppercase">New drops every week</span>
          </div>

          <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-black leading-[0.88] tracking-tighter text-white mb-8">
            Digital<br />
            <span className="text-[#c8f533]">Products</span><br />
            That Hit.
          </h1>

          <p className="text-white/40 text-lg max-w-md mb-12 font-light leading-relaxed">
            Premium templates, tools & assets for creators who refuse to settle.
            Instant download. Lifetime access.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-8 py-4 rounded-full text-sm tracking-wide hover:bg-white transition-colors duration-200"
            >
              Browse All Products
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 font-medium px-8 py-4 rounded-full text-sm hover:border-white/40 hover:text-white transition-all duration-200"
            >
              My Orders
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-10 mt-20 pt-10 border-t border-white/8">
            {[
              { value: "500+", label: "Digital Products" },
              { value: "12k+", label: "Happy Customers" },
              { value: "Instant", label: "Delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/35 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOST POPULAR ── */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Trending</p>
            <h2 className="text-4xl font-black text-white tracking-tight">Most Popular</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-white/40 hover:text-[#c8f533] transition-colors font-medium flex items-center gap-1"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {popularProducts.map((product) => (
            <ProductsCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── NEWEST ── */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Just Dropped</p>
            <h2 className="text-4xl font-black text-white tracking-tight">Newest Products</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-white/40 hover:text-[#c8f533] transition-colors font-medium flex items-center gap-1"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {newestProducts.map((product) => (
            <ProductsCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-[#c8f533] p-12 md:p-16">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-black/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight leading-tight mb-4">
              Ready to level<br />up your workflow?
            </h2>
            <p className="text-black/60 text-lg mb-8 max-w-md">
              Browse our full catalogue of digital products built for professionals.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full text-sm hover:bg-zinc-800 transition-colors"
            >
              Shop Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function getMostPopularProducts() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 5,
  })
}

function getNewestProducts() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })
}
