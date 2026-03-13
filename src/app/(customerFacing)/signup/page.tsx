"use client"

import Link from "next/link"
import React from "react"
import { useActionState } from "react"
import { signupAction } from "./actions"

type FormErrors =
  | {
      firstName?: string[]
      lastName?: string[]
      email?: string[]
      password?: string[]
      confirmPassword?: string[]
    }
  | { general: string }
  | undefined

export default function SignupPage() {
  const [errors, action, isPending] = useActionState<FormErrors, FormData>(
    signupAction,
    undefined
  )

  const fieldErrors = errors && !("general" in errors) ? errors : null
  const generalError = errors && "general" in errors ? errors.general : null

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8f53315] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">
          <Link href="/" className="text-white font-black text-2xl tracking-tighter">
            Buoyant<span className="text-[#c8f533]">.</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase">Get started free</p>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">
            Join thousands<br />
            of creators<br />
            today<span className="text-[#c8f533]">.</span>
          </h2>
          <p className="text-white/35 text-base max-w-sm leading-relaxed">
            Create your account to start buying and downloading premium digital products instantly.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "Instant access after purchase",
              "Lifetime download access",
              "Order history & receipts",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-white/50">
                <span className="w-5 h-5 rounded-full bg-[#c8f533]/15 border border-[#c8f533]/30 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#c8f533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="text-white/20 text-xs font-mono">No credit card required to sign up.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
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
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Create account</h1>
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#c8f533] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* General error */}
          {generalError && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">
              {generalError}
            </p>
          )}

          {/* Form */}
          <form action={action} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
                />
                {fieldErrors?.firstName && (
                  <p className="text-red-400 text-xs">{fieldErrors.firstName[0]}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
                />
                {fieldErrors?.lastName && (
                  <p className="text-red-400 text-xs">{fieldErrors.lastName[0]}</p>
                )}
              </div>
            </div>

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
              {fieldErrors?.email && (
                <p className="text-red-400 text-xs">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Min. 8 characters"
                required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
              />
              {fieldErrors?.password && (
                <p className="text-red-400 text-xs">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 focus:bg-white/6 transition-all"
              />
              {fieldErrors?.confirmPassword && (
                <p className="text-red-400 text-xs">{fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-0.5 w-4 h-4 accent-[#c8f533] flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-white/35 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-white/60 hover:text-[#c8f533] underline transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-white/60 hover:text-[#c8f533] underline transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#c8f533] text-black font-bold py-4 rounded-xl text-sm tracking-wide hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating account..." : "Create account →"}
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

        </div>
      </div>
    </div>
  )
}
