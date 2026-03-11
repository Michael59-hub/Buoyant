"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: string
  name: string
  price: number
  imagePath: string
  description: string
  category: string
  isAvailableForPurchase: boolean
  createdAt: string
}

const CATEGORIES = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "image", label: "Images", emoji: "🖼️" },
  { id: "book", label: "Books", emoji: "📖" },
  { id: "template", label: "Templates", emoji: "📐" },
  { id: "font", label: "Fonts", emoji: "Aa" },
  { id: "video", label: "Video", emoji: "🎬" },
  { id: "software", label: "Software", emoji: "💾" },
  { id: "course", label: "Courses", emoji: "🎓" },
  { id: "preset", label: "Presets", emoji: "🎛️" },
]

const CATEGORY_COLORS: Record<string, string> = {
  music:    "text-purple-400 bg-purple-400/10 border-purple-400/20",
  image:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  book:     "text-orange-400 bg-orange-400/10 border-orange-400/20",
  template: "text-[#c8f533] bg-[#c8f533]/10 border-[#c8f533]/20",
  font:     "text-pink-400 bg-pink-400/10 border-pink-400/20",
  video:    "text-red-400 bg-red-400/10 border-red-400/20",
  software: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  course:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  preset:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
}

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc"
type ViewMode = "grid" | "list"

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ product }: { product: Product }) {
  const catColor = CATEGORY_COLORS[product.category] ?? "text-white/40 bg-white/5 border-white/10"
  const catLabel = CATEGORIES.find(c => c.id === product.category)

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-[#c8f533]/30 hover:bg-white/[0.06] transition-all duration-300"
    >
      <div className="relative aspect-[4/3] w-full bg-white/5 overflow-hidden">
        {product.imagePath ? (
          <Image
            src={`https://res.cloudinary.com/dmal6jha3/image/upload/v1773235223/${product.imagePath}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20">{catLabel?.emoji}</span>
          </div>
        )}
        {!product.isAvailableForPurchase && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Unavailable</span>
          </div>
        )}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#c8f533] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className={`self-start text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border ${catColor}`}>
          {catLabel?.label ?? product.category}
        </span>
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#c8f533] transition-colors">
          {product.name}
        </h3>
        <p className="text-white/30 text-xs line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
        <div className="pt-2 border-t border-white/6 flex items-center justify-between">
          <span className="text-[#c8f533] font-black text-lg">${(product.price / 100).toFixed(2)}</span>
          <span className="text-[10px] text-white/20 font-mono">USD</span>
        </div>
      </div>
    </Link>
  )
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ product }: { product: Product }) {
  const catColor = CATEGORY_COLORS[product.category] ?? "text-white/40 bg-white/5 border-white/10"
  const catLabel = CATEGORIES.find(c => c.id === product.category)

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-4 hover:border-[#c8f533]/30 hover:bg-white/[0.06] transition-all duration-200"
    >
      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
        {product.imagePath ? (
          <Image
            src={`https://res.cloudinary.com/dmal6jha3/image/upload/v1773235223/${product.imagePath}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">
            {catLabel?.emoji}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${catColor}`}>
            {catLabel?.label ?? product.category}
          </span>
          {!product.isAvailableForPurchase && (
            <span className="text-[10px] font-mono text-red-400/60 border border-red-400/20 bg-red-400/5 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-sm truncate group-hover:text-[#c8f533] transition-colors">
          {product.name}
        </h3>
        <p className="text-white/30 text-xs line-clamp-1 mt-0.5">{product.description}</p>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0">
        <span className="text-[#c8f533] font-black text-xl">${(product.price / 100).toFixed(2)}</span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#c8f533] group-hover:border-[#c8f533] transition-all duration-200">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function CatalogClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sort, setSort] = useState<SortOption>("newest")
  const [view, setView] = useState<ViewMode>("grid")

  const filtered = useMemo(() => {
    const result = activeCategory === "all"
      ? [...products]
      : products.filter(p => p.category === activeCategory)

    if (sort === "newest")     result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sort === "oldest")     result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price)

    return result
  }, [activeCategory, sort, products])

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory)

  // Only show category pills that have products
  const visibleCategories = CATEGORIES.filter(cat =>
    cat.id === "all" || products.some(p => p.category === cat.id)
  )

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-12">
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-3">Catalog</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
            Browse<br />Products
          </h1>
          <p className="text-white/35 text-base max-w-md">
            {products.length} digital products across {visibleCategories.length - 1} categories. Instant download. Lifetime access.
          </p>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {visibleCategories.map((cat) => {
            const count = cat.id === "all"
              ? products.length
              : products.filter(p => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? "bg-[#c8f533] text-black border-[#c8f533]"
                    : "bg-white/4 text-white/50 border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-xs font-mono ${activeCategory === cat.id ? "text-black/50" : "text-white/25"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/8">
          <p className="text-sm text-white/40">
            <span className="text-white font-bold">{filtered.length}</span> results
            {activeCategory !== "all" && (
              <span> in <span className="text-[#c8f533]">{activeCategoryData?.label}</span></span>
            )}
          </p>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-white/5 border border-white/10 text-white/60 text-sm rounded-full px-4 py-2 outline-none hover:border-white/20 focus:border-[#c8f533]/40 transition-colors cursor-pointer"
            >
              <option value="newest"     className="bg-[#111] text-white">Newest First</option>
              <option value="oldest"     className="bg-[#111] text-white">Oldest First</option>
              <option value="price-asc"  className="bg-[#111] text-white">Price: Low → High</option>
              <option value="price-desc" className="bg-[#111] text-white">Price: High → Low</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setView("grid")}
                title="Grid view"
                className={`p-2 rounded-full transition-all duration-200 ${view === "grid" ? "bg-[#c8f533] text-black" : "text-white/40 hover:text-white"}`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1.5"/>
                  <rect x="9" y="1" width="6" height="6" rx="1.5"/>
                  <rect x="1" y="9" width="6" height="6" rx="1.5"/>
                  <rect x="9" y="9" width="6" height="6" rx="1.5"/>
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                title="List view"
                className={`p-2 rounded-full transition-all duration-200 ${view === "list" ? "bg-[#c8f533] text-black" : "text-white/40 hover:text-white"}`}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="2.5" rx="1.25"/>
                  <rect x="1" y="6.75" width="14" height="2.5" rx="1.25"/>
                  <rect x="1" y="11.5" width="14" height="2.5" rx="1.25"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-6xl mb-6 opacity-30">{activeCategoryData?.emoji}</span>
            <p className="text-white/30 text-lg font-medium">No products in this category yet.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-6 text-sm text-[#c8f533] hover:underline"
            >
              View all products →
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => <GridCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(product => <ListRow key={product.id} product={product} />)}
          </div>
        )}

      </div>
    </div>
  )
}
