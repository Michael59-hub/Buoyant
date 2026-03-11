import { Nav, NavLink } from "@/components/Nav"

export const dynamic = "force-dynamic"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#080808]">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <main>{children}</main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 mt-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white font-black text-xl tracking-tighter">
            Buoyant<span className="text-[#c8f533]">.</span>
          </span>
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} Buoyant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
