import Link from "next/link"
import { prisma } from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/productAction"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const AdminProductPage = () => {
  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Admin</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New Product
          </Link>
        </div>

        <ProductsTable />
      </div>
    </div>
  )
}

const ProductsTable = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      isAvailableForPurchase: true,
      imagePath: true,
      category: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  })

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-white/8 rounded-2xl bg-white/[0.02]">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="white" strokeWidth="1.5" strokeOpacity=".3"/>
            <path d="M16 3H8L6 7h12l-2-4z" stroke="white" strokeWidth="1.5" strokeOpacity=".3"/>
          </svg>
        </div>
        <p className="text-white/30 text-sm mb-4">No products yet</p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white transition-colors"
        >
          Add your first product
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/[0.02]">

      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 border-b border-white/8 bg-white/[0.02]">
        <div className="w-5" />
        <span className="text-xs font-mono text-white/25 uppercase tracking-widest">Product</span>
        <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-20 text-right">Price</span>
        <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-16 text-right">Orders</span>
        <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-20 text-center">Status</span>
        <div className="w-8" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-white/[0.025] transition-colors group"
          >
            {/* Status dot */}
            <div className="w-5 flex justify-center">
              <div className={`w-2 h-2 rounded-full ${product.isAvailableForPurchase ? "bg-[#c8f533]" : "bg-white/15"}`} />
            </div>

            {/* Name + category */}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{product.name}</p>
              <p className="text-white/25 text-xs font-mono capitalize mt-0.5">{product.category}</p>
            </div>

            {/* Price */}
            <div className="w-20 text-right">
              <span className="text-[#c8f533] font-bold text-sm font-mono">
                {formatCurrency(product.price / 100)}
              </span>
            </div>

            {/* Orders */}
            <div className="w-16 text-right">
              <span className="text-white/40 text-sm font-mono">
                {formatNumber(product._count.orders)}
              </span>
            </div>

            {/* Status badge */}
            <div className="w-20 flex justify-center">
              {product.isAvailableForPurchase ? (
                <span className="text-[10px] font-mono font-bold text-[#c8f533] bg-[#c8f533]/10 border border-[#c8f533]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-white/25 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hidden
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="w-8 flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white hover:bg-white/8 transition-all opacity-0 group-hover:opacity-100 outline-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#111] border border-white/10 rounded-xl shadow-xl w-44 p-1">
                  <DropdownMenuItem asChild className="rounded-lg text-white/60 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer text-sm px-3 py-2">
                    <a download href={`/admin/products/${product.id}/download`}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-2">
                        <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg text-white/60 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer text-sm px-3 py-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-2">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                  <DropdownMenuSeparator className="bg-white/8 my-1" />
                  <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-white/8 bg-white/[0.015] flex items-center justify-between">
        <p className="text-xs text-white/20 font-mono">
          {products.length} product{products.length !== 1 ? "s" : ""} total
        </p>
        <p className="text-xs text-white/20 font-mono">
          {products.filter(p => p.isAvailableForPurchase).length} live · {products.filter(p => !p.isAvailableForPurchase).length} hidden
        </p>
      </div>
    </div>
  )
}

export default AdminProductPage
