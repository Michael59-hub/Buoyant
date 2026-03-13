"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, useState, useEffect, useRef } from "react"
import { signOut, useSession } from "next-auth/react"

export function Nav({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"
  const isAdmin = (session?.user as any)?.role === "admin"

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
          {isAdmin && (
            <NavLink href="/admin">Admin</NavLink>
          )}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            // Skeleton while session loads
            <div className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : isLoggedIn ? (
            <UserMenu session={session} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full text-sm font-bold bg-[#c8f533] text-black hover:bg-white transition-colors duration-200"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() ?? "?"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full pl-1 pr-4 py-1 hover:border-white/20 transition-all duration-200"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#c8f533] flex items-center justify-center text-black text-xs font-black">
          {initials}
        </div>
        <span className="text-white/70 text-sm font-medium max-w-[120px] truncate">
          {session?.user?.name?.split(" ")[0] ?? session?.user?.email}
        </span>
        {/* Chevron */}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/50 py-1">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-white/35 text-xs truncate mt-0.5">{session?.user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              My Orders
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-white/8 py-1">
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
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
