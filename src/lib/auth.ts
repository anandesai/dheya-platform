import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { UserRole, UserSegment } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      role: UserRole
      segment: UserSegment | null
      onboardingComplete: boolean
      image?: string | null
    }
  }

  interface User {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: UserRole
    segment: UserSegment | null
    onboardingComplete: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: UserRole
    segment: UserSegment | null
    onboardingComplete: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name ?? null,
          lastName: profile.family_name ?? null,
          image: profile.picture,
          role: "USER" as UserRole,
          segment: null,
          onboardingComplete: false,
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          segment: user.segment,
          onboardingComplete: user.onboardingComplete,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
        token.segment = user.segment
        token.onboardingComplete = user.onboardingComplete
      }

      // Handle session updates (e.g., after onboarding)
      if (trigger === "update" && session) {
        token.segment = session.segment ?? token.segment
        token.onboardingComplete = session.onboardingComplete ?? token.onboardingComplete
        token.firstName = session.firstName ?? token.firstName
        token.lastName = session.lastName ?? token.lastName
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.role = token.role
        session.user.segment = token.segment
        session.user.onboardingComplete = token.onboardingComplete
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Log new user registration
      console.log(`New user registered: ${user.email}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
}
