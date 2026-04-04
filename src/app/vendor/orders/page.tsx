import { auth } from "@/auth"
import { prisma } from "@/db/db"
import { formatCurrency } from "@/lib/formatters"

export default async function VendorOrdersPage() {
  const session = await auth()
  const vendorId = session?.user?.id!

  const orders = await prisma.order.findMany({
    where: { product: { vendorId } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      pricePaid: true,
      createdAt: true,
      product: { select: { id: true, name: true, category: true } },
      user: { select: { name: true, email: true } },
    },
  })

  const totalRevenue = orders.reduce((sum, o) => sum + o.pricePaid, 0)

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase mb-2">Vendor Portal</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Sales</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-[#c8f533]">{formatCurrency(totalRevenue / 100)}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-white/8 rounded-2xl bg-white/[0.02]">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="1.5" strokeOpacity=".3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-white/30 text-sm">No sales yet</p>
          </div>
        ) : (
          <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/[0.02]">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 px-6 py-3 border-b border-white/8 bg-white/[0.02]">
              <span className="text-xs font-mono text-white/25 uppercase tracking-widest">Product / Customer</span>
              <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-24 text-right">Amount</span>
              <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-28 text-right">Date</span>
              <span className="text-xs font-mono text-white/25 uppercase tracking-widest w-16 text-center">Status</span>
            </div>

            <div className="divide-y divide-white/5">
              {orders.map((order) => (
                <div key={order.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{order.product.name}</p>
                    <p className="text-white/30 text-xs truncate mt-0.5">
                      {order.user.name ?? order.user.email}
                      {order.user.name && (
                        <span className="text-white/15"> · {order.user.email}</span>
                      )}
                    </p>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-[#c8f533] font-bold text-sm font-mono">
                      {formatCurrency(order.pricePaid / 100)}
                    </span>
                  </div>
                  <div className="w-28 text-right">
                    <p className="text-white/40 text-xs font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Paid
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-white/8 bg-white/[0.015] flex items-center justify-between">
              <p className="text-xs text-white/20 font-mono">{orders.length} sale{orders.length !== 1 ? "s" : ""} total</p>
              <p className="text-xs text-white/20 font-mono">{formatCurrency(totalRevenue / 100)} earned</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
