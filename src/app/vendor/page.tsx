import { auth } from "@/auth"
import { prisma } from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import Link from "next/link"

export default async function VendorDashboard() {
  const session = await auth()
  const vendorId = session?.user?.id
  if (!vendorId) return null

  const [salesData, productData, recentSales, topProducts] = await Promise.all([
    getVendorSalesData(vendorId),
    getVendorProductData(vendorId),
    getRecentSales(vendorId),
    getTopProducts(vendorId),
  ])

  const firstName = session?.user?.name?.split(" ")[0] ?? "Vendor"

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Vendor Portal</p>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Hey, {firstName}<span className="text-[#c8f533]">.</span>
            </h1>
          </div>
          <Link
            href="/vendor/products/new"
            className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New Product
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(salesData.revenue)}
            sub={`${formatNumber(salesData.totalOrders)} orders`}
            accent="#c8f533"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Active Products"
            value={formatNumber(productData.activeCount)}
            sub={`${formatNumber(productData.inactiveCount)} inactive`}
            accent="#60a5fa"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Products"
            value={formatNumber(productData.activeCount + productData.inactiveCount)}
            sub="all listings"
            accent="#a78bfa"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Avg. Order Value"
            value={formatCurrency(salesData.totalOrders === 0 ? 0 : salesData.revenue / salesData.totalOrders)}
            sub="per sale"
            accent="#34d399"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent sales */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">Latest</p>
                <h2 className="text-white font-bold text-base">Recent Sales</h2>
              </div>
              <Link href="/vendor/orders" className="text-xs text-white/30 hover:text-[#c8f533] transition-colors font-mono">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentSales.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-white/20 text-sm mb-2">No sales yet</p>
                  <Link href="/vendor/products/new" className="text-xs text-[#c8f533] hover:underline">
                    Add your first product →
                  </Link>
                </div>
              ) : (
                recentSales.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#c8f533]/10 border border-[#c8f533]/20 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M2 5h12M2 8h8M2 11h5" stroke="#c8f533" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{order.product.name}</p>
                      <p className="text-white/30 text-xs truncate">{order.user.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#c8f533] font-bold text-sm">{formatCurrency(order.pricePaid / 100)}</p>
                      <p className="text-white/20 text-xs font-mono">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">Performance</p>
              <h2 className="text-white font-bold text-base">Top Products</h2>
            </div>
            <div className="divide-y divide-white/5">
              {topProducts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-white/20 text-sm">No products yet</p>
                </div>
              ) : (
                topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <span className="text-xs font-mono text-white/20 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.name}</p>
                      <p className="text-white/25 text-xs font-mono">{formatNumber(product._count.orders)} sales</p>
                    </div>
                    <p className="text-[#c8f533] font-bold text-sm font-mono flex-shrink-0">
                      {formatCurrency(product.price / 100)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/8">
              <Link href="/vendor/products" className="text-xs text-white/30 hover:text-[#c8f533] transition-colors font-mono">
                Manage all products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent, icon }: {
  label: string; value: string; sub: string; accent: string; icon: React.ReactNode
}) {
  return (
    <div className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 overflow-hidden hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs text-white/20">{sub}</p>
      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none" style={{ background: accent }} />
    </div>
  )
}

// Data fetchers — all scoped to vendorId
async function getVendorSalesData(vendorId: string) {
  const data = await prisma.order.aggregate({
    where: { product: { vendorId } },
    _sum: { pricePaid: true },
    _count: true,
  })
  return {
    revenue: (data._sum.pricePaid ?? 0) / 100,
    totalOrders: data._count,
  }
}

async function getVendorProductData(vendorId: string) {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { vendorId, isAvailableForPurchase: true } }),
    prisma.product.count({ where: { vendorId, isAvailableForPurchase: false } }),
  ])
  return { activeCount, inactiveCount }
}

async function getRecentSales(vendorId: string) {
  return prisma.order.findMany({
    where: { product: { vendorId } },
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      pricePaid: true,
      createdAt: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
  })
}

async function getTopProducts(vendorId: string) {
  return prisma.product.findMany({
    where: { vendorId },
    orderBy: { orders: { _count: "desc" } },
    take: 5,
    select: {
      id: true,
      name: true,
      price: true,
      _count: { select: { orders: true } },
    },
  })
}
