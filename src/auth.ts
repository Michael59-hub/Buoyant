import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/db/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)
          console.log("parsed result:", parsed.success, parsed.success ? "ok" : parsed.error.issues)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        })

         console.log("user found:", user ? "yes" : "no")

        if (!user || !user.hashedPassword) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.hashedPassword
        )

        if (!passwordMatch) return null

        // Include role here so it flows into the token
        return { id: user.id, email: user.email, name: user.name, role: user.role as  "customer" | "vendor" | "admin" }
      }
    })
  ],
  pages: { signIn: "/login" , error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // When user first signs in, copy role into the token
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    async session({ session, token }) {
      // Copy from token into session so your app can read it
      if (token.sub) session.user.id = token.sub
      if (token.role) (session.user as { role?: string }).role = token.role as string
      return session
    }
  }
})