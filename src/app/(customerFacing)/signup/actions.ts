"use server"

import { prisma } from "@/db/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function signupAction(prevState: unknown, formData: FormData) {
  const result = signupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) return result.error.formErrors.fieldErrors

  const { firstName, lastName, email, password } = result.data

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { email: ["An account with this email already exists"] }

  // Hash the password — NEVER store plain text passwords
  const hashedPassword = await bcrypt.hash(password, 12)
  // The 12 is the "salt rounds" — higher = more secure but slower

  await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      hashedPassword,
    }
  })

  // Automatically sign them in after signup
  await signIn("credentials", { email, password, redirectTo: "/" })
}