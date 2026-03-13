import { prisma } from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import Link from "next/link"

export default async function AdminDashboard() {
  const [salesData, userData, productData, recentOrders] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    getRecentOrders(),
  ])

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Overview</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#c8f533] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              New Product
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 border border-white/10 text-white/60 font-medium px-5 py-2.5 rounded-full text-sm hover:border-white/25 hover:text-white transition-all"
            >
              All Products
            </Link>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(salesData.amount)}
            sub={`${formatNumber(salesData.numberOfSales)} orders`}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" opacity=".3"/>
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
              </svg>
            }
            accent="#c8f533"
            trend="+12%"
          />
          <StatCard
            label="Total Orders"
            value={formatNumber(salesData.numberOfSales)}
            sub="all time"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="currentColor"/>
              </svg>
            }
            accent="#60a5fa"
            trend="+8%"
          />
          <StatCard
            label="Customers"
            value={formatNumber(userData.userCount)}
            sub={`${formatCurrency(userData.averageValuePerUser)} avg value`}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
              </svg>
            }
            accent="#a78bfa"
            trend="+23%"
          />
          <StatCard
            label="Active Products"
            value={formatNumber(productData.activeCount)}
            sub={`${formatNumber(productData.inactiveCount)} inactive`}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.98 16.07 1 13.64 1 12.28 1 11.08 1.8 10.5 3L10 4 9.5 3C8.92 1.8 7.72 1 6.36 1 3.93 1 2 2.98 2 5.5c0 3.78 3.4 6.86 8.55 11.54L12 18.35l1.45-1.32C18.6 12.36 22 9.28 22 5.5 22 3.04 20.37 1 18 1v-.01L20 6z" fill="currentColor"/>
              </svg>
            }
            accent="#34d399"
            trend=""
          />
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">Latest</p>
                <h2 className="text-white font-bold text-base">Recent Orders</h2>
              </div>
              <Link href="/admin/orders" className="text-xs text-white/30 hover:text-[#c8f533] transition-colors font-mono">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <div className="px-6 py-10 text-center text-white/20 text-sm">No orders yet</div>
              ) : (
                recentOrders.map((order) => (
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

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/8">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">Admin</p>
                <h2 className="text-white font-bold text-base">Quick Links</h2>
              </div>
              <div className="p-3 flex flex-col gap-1">
                {[
                  { label: "Manage Products", href: "/admin/products", icon: "📦" },
                  { label: "View Orders", href: "/admin/orders", icon: "🧾" },
                  { label: "Customers", href: "/admin/users", icon: "👥" },
                  { label: "Add New Product", href: "/admin/products/new", icon: "➕" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="ml-auto opacity-30">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Product breakdown */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Inventory</p>
              <h2 className="text-white font-bold text-base mb-5">Product Status</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">Active</span>
                    <span className="text-[#c8f533] font-mono">{productData.activeCount}</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c8f533] rounded-full"
                      style={{
                        width: `${productData.activeCount + productData.inactiveCount === 0 ? 0 : (productData.activeCount / (productData.activeCount + productData.inactiveCount)) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">Inactive</span>
                    <span className="text-white/40 font-mono">{productData.inactiveCount}</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/20 rounded-full"
                      style={{
                        width: `${productData.activeCount + productData.inactiveCount === 0 ? 0 : (productData.inactiveCount / (productData.activeCount + productData.inactiveCount)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── STAT CARD COMPONENT ──────────────────────────────────────────────────────
type StatCardProps = {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: string
  trend: string
}

function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  return (
    <div className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 overflow-hidden hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs text-white/20">{sub}</p>

      {/* Subtle accent glow */}
      <div
        className="absolute bottom-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ background: accent }}
      />
    </div>
  )
}

// ── DATA FETCHERS ────────────────────────────────────────────────────────────
const getSalesData = async () => {
  const data = await prisma.order.aggregate({
    _sum: { pricePaid: true },
    _count: true,
  })
  return {
    amount: (data._sum.pricePaid || 0) / 100,
    numberOfSales: data._count,
  }
}

const getUserData = async () => {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count({where: { role:{not: "admin"} }}),
    prisma.order.aggregate({ _sum: { pricePaid: true } }),
  ])
  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaid || 0) / userCount / 100,
  }
}

const getProductData = async () => {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ])
  return { activeCount, inactiveCount }
}

const getRecentOrders = async () => {
  return prisma.order.findMany({
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
