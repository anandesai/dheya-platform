"use client"

// Redirect to the edit page with "new" as the toolId
import { redirect } from "next/navigation"

export default function NewToolPage() {
  redirect("/admin/tools/new/edit")
}
