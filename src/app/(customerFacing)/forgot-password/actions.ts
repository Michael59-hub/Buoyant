"use server"

import { prisma } from "@/db/db"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
})

export async function forgotPasswordAction(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return { error: "Please enter a valid email address." }

  const { email } = result.data

  // Always return success even if email doesn't exist — prevents email enumeration
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { success: true }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } })

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, email, expiresAt },
  })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  try {
    await sendPasswordResetEmail(email, resetUrl)
  } catch {
    return { error: "Failed to send email. Please try again." }
  }

  return { success: true }
}
