"use server"

import { prisma } from "@/db/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function resetPasswordAction(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!result.success) return { fieldErrors: result.error.formErrors.fieldErrors }

  const { token, password } = result.data

  // Find and validate token
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!resetToken) return { error: "Invalid or expired reset link." }
  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    return { error: "This reset link has expired. Please request a new one." }
  }

  // Update the password
  const hashedPassword = await bcrypt.hash(password, 12)
  await prisma.user.update({
    where: { email: resetToken.email },
    data: { hashedPassword },
  })

  // Delete the used token
  await prisma.passwordResetToken.delete({ where: { token } })

  redirect("/login?message=password-reset")
}
