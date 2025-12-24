import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SessionHistoryClient } from "./session-history-client"

export const metadata = {
  title: "Session History | Dheya Career Mentors",
  description: "View your past mentoring sessions and notes",
}

export default async function SessionHistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login")
  }

  return <SessionHistoryClient />
}
