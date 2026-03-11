import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { prisma } from "@/db/db"
import Link from "next/link"
import { getProductById } from "@/lib/cache"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-[#080808]">
        <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-4">404</p>
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">Product Not Found</h1>
        <p className="text-white/40 mb-10 max-w-sm">
          We couldn&apos;t find the product you&apos;re looking for. It may have been removed or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-8 py-4 rounded-full text-sm hover:bg-white transition-colors"
        >
          Back to Home
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/30 font-mono mb-12">
          <Link href="/" className="hover:text-[#c8f533] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#c8f533] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── IMAGE ── */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white/5 border border-white/8">
            <Image
              src={`https://res.cloudinary.com/dmal6jha3/image/upload/v1773235223/${product.imagePath}`}
              alt={product.name}
              fill
              className="object-cover"
            />
            {/* Availability badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-sm ${
                product.isAvailableForPurchase
                  ? "bg-[#c8f533]/15 border-[#c8f533]/30 text-[#c8f533]"
                  : "bg-red-500/15 border-red-500/30 text-red-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailableForPurchase ? "bg-[#c8f533]" : "bg-red-400"}`} />
                {product.isAvailableForPurchase ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* ── DETAILS ── */}
          <div className="flex flex-col gap-8 lg:pt-4">

            {/* Name & price */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-[#c8f533]">
                  ${(product.price / 100).toFixed(2)}
                </span>
                <span className="text-sm text-white/30 font-mono">USD</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* Description */}
            <div>
              <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-3">About this product</p>
              <p className="text-white/60 leading-relaxed text-base">{product.description}</p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {["Instant Download", "Lifetime Access", "Commercial License"].map((feat) => (
                <span
                  key={feat}
                  className="text-xs text-white/50 border border-white/10 rounded-full px-3 py-1.5 font-mono"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/8" />

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button
                disabled={!product.isAvailableForPurchase}
                className={`w-full py-5 rounded-2xl text-base font-bold tracking-wide transition-all duration-200 ${
                  product.isAvailableForPurchase
                    ? "bg-[#c8f533] text-black hover:bg-white cursor-pointer"
                    : "bg-white/8 text-white/25 cursor-not-allowed"
                }`}
              >
                {product.isAvailableForPurchase ? "Purchase Now →" : "Currently Unavailable"}
              </button>

              <Link
                href="/products"
                className="w-full py-4 rounded-2xl text-sm font-medium text-white/40 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all text-center"
              >
                ← Back to Products
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const products = await prisma.product.findMany({ select: { id: true } })
  return products.map((product) => ({ id: product.id }))
}
