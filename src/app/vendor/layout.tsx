import { auth } from "@/auth"
import { Nav, NavLink } from "@/components/Nav"
import SessionWrapper from "@/components/SessionWrapper"

export const dynamic = "force-dynamic"

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <SessionWrapper session={session}>
      <div className="min-h-screen bg-[#080808]">
        <Nav>
          <NavLink href="/vendor">Dashboard</NavLink>
          <NavLink href="/vendor/products">Products</NavLink>
          <NavLink href="/vendor/orders">Sales</NavLink>
        </Nav>
        <main>{children}</main>
        <footer className="border-t border-white/8 mt-10 px-6 py-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white font-black text-xl tracking-tighter">
              Buoyant<span className="text-[#c8f533]">.</span>
            </span>
            <p className="text-white/25 text-sm">
              © {new Date().getFullYear()} Buoyant. Vendor Portal.
            </p>
          </div>
        </footer>
      </div>
    </SessionWrapper>
  )
}
