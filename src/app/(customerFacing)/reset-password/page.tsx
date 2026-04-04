"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { resetPasswordAction } from "./actions"

type State = {
  error?: string
  fieldErrors?: { password?: string[]; confirmPassword?: string[] }
} | undefined

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const actionWithToken = async (prevState: State, formData: FormData) => {
    formData.append("token", token ?? "")
    return resetPasswordAction(prevState, formData)
  }

  const [state, action, isPending] = useActionState<State, FormData>(
    actionWithToken,
    undefined
  )

  if (!token) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white mb-3">Invalid link</h1>
          <p className="text-white/40 text-sm mb-6">This reset link is invalid or has already been used.</p>
          <Link href="/forgot-password" className="text-[#c8f533] hover:underline text-sm font-medium">
            Request a new reset link →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#c8f53315] blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">
          <Link href="/" className="text-white font-black text-2xl tracking-tighter">
            Buoyant<span className="text-[#c8f533]">.</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <p className="text-xs font-mono text-[#c8f533] tracking-[0.2em] uppercase">Almost there</p>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.9]">
            Choose a<br />
            new password<span className="text-[#c8f533]">.</span>
          </h2>
          <p className="text-white/35 text-base max-w-sm leading-relaxed">
            Pick something strong. At least 8 characters with a mix of letters and numbers.
          </p>
        </div>

        <div className="relative">
          <p className="text-white/20 text-xs font-mono">You'll be signed in automatically after resetting.</p>
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
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">New password</h1>
            <p className="text-white/40 text-sm">Must be at least 8 characters.</p>
          </div>

          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{state.error}</p>
                {state.error.includes("expired") && (
                  <Link href="/forgot-password" className="text-xs text-red-400/70 hover:text-red-400 underline mt-1 block">
                    Request a new link →
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                New password
              </label>
              <input
                type="password" id="password" name="password"
                placeholder="Min. 8 characters" required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all"
              />
              {state?.fieldErrors?.password && (
                <p className="text-red-400 text-xs">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-mono text-white/40 uppercase tracking-[0.15em]">
                Confirm password
              </label>
              <input
                type="password" id="confirmPassword" name="confirmPassword"
                placeholder="••••••••" required
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c8f533]/50 transition-all"
              />
              {state?.fieldErrors?.confirmPassword && (
                <p className="text-red-400 text-xs">{state.fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            <button
              type="submit" disabled={isPending}
              className="w-full bg-[#c8f533] text-black font-bold py-4 rounded-xl text-sm tracking-wide hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Resetting..." : "Reset password →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
