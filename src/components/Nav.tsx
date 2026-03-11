"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"

export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#080808]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
          Buoyant<span className="text-[#c8f533]">.</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {children}
        </div>
      </div>
    </nav>
  )
}

export function NavLink({ href, children, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      {...props}
      className={`
        relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${isActive
          ? "bg-[#c8f533] text-black"
          : "text-white/50 hover:text-white hover:bg-white/8"
        }
      `}
    >
      {children}
    </Link>
  )
}
