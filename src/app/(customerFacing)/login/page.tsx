"use client"

import React from "react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      })

      if (!result || result.error) {
        setLoading(false)
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
    return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* ── LEFT PANEL (branding) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-white/8 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c8f53315] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">
          <Link href="/" className="text-white font-black text-2xl tracking-tighter">
            Buoyant<span className="text-[#c8f533]">.</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase">Welcome back</p>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">
            Your digital<br />
            products<br />
            await<span className="text-[#c8f533]">.</span>
          </h2>
          <p className="text-white/35 text-base max-w-sm leading-relaxed">
            Sign in to access your purchases, download your files, and manage your orders.
          </p>
        </div>

        <div className="relative flex items-center gap-6">
          {[
            { value: "500+", label: "Products" },
            { value: "12k+", label: "Customers" },
            { value: "Instant", label: "Downloads" },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-white/10 pl-6 first:border-0 first:pl-0">
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/30 font-mono mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="text-white font-black text-2xl tracking-tighter">
              Buoyant<span className="text-[#c8f533]">.</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sign in</h1>
            <p className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#c8f533] hover:underline font-medium">
                Create one free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {urlError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                Invalid email or password
              </p>
            )}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-white/30 hover:text-[#c8f533] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
              />
            </div>

            <button type="submit" disabled={loading}  className="w-full bg-[#c8f533] text-black font-bold py-4 rounded-xl text-sm tracking-wide hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/20 font-mono">OR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* OAuth */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white/60 text-sm font-medium hover:bg-white/8 hover:border-white/20 hover:text-white transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-white/20 text-xs mt-8 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/terms" className="hover:text-white/40 underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="hover:text-white/40 underline">Privacy Policy</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
