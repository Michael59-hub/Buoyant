"use client"

import Link from "next/link"
import { useActionState } from "react"
import { forgotPasswordAction } from "./actions"

type State = { success?: boolean; error?: string } | undefined

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState<State, FormData>(
    forgotPasswordAction,
    undefined
  )

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c8f53315] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">
          <Link href="/" className="text-white font-black text-2xl tracking-tighter">
            Buoyant<span className="text-[#c8f533]">.</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase">Account recovery</p>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">
            Forgot your<br />
            password<span className="text-[#c8f533]">?</span>
          </h2>
          <p className="text-white/35 text-base max-w-sm leading-relaxed">
            No worries. Enter your email and we&apos;ll send you a link to reset it.
          </p>
        </div>

        <div className="relative">
          <p className="text-white/20 text-xs font-mono">Reset link expires in 1 hour.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <div className="lg:hidden mb-10">
            <Link href="/" className="text-white font-black text-2xl tracking-tighter">
              Buoyant<span className="text-[#c8f533]">.</span>
            </Link>
          </div>

          <div className="mb-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/60 transition-colors mb-6">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to login
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Reset password</h1>
            <p className="text-white/40 text-sm">We&apos;ll send a reset link to your email.</p>
          </div>

          {state?.success ? (
            // Success state
            <div className="bg-[#c8f533]/5 border border-[#c8f533]/20 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#c8f533]/15 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zM4 6h16l-8 5-8-5z" fill="#c8f533" fillOpacity=".3"/>
                  <path d="M22 6l-10 7L2 6" stroke="#c8f533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Check your email</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                If an account exists for that email, we&apos;ve sent a password reset link. Check your inbox and spam folder.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[#c8f533] hover:underline"
              >
                Back to login →
              </Link>
            </div>
          ) : (
            // Form state
            <form action={action} className="space-y-5">
              {state?.error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {state.error}
                </p>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                  Email address
                </label>
                <input
                  type="email" id="email" name="email"
                  placeholder="you@example.com" required
                  className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all"
                />
              </div>

              <button
                type="submit" disabled={isPending}
                className="w-full bg-[#c8f533] text-black font-bold py-4 rounded-xl text-sm tracking-wide hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send reset link →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
