// Clone Package API Route
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/admin/packages/[id]/clone - Clone a package
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    if (!body.newCode) {
      return NextResponse.json(
        { error: "newCode is required" },
        { status: 400 }
      )
    }

    const pkg = await packageService.clonePackage(id, body.newCode)
    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    console.error("Error cloning package:", error)

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Package with this code already exists" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to clone package" },
      { status: 500 }
    )
  }
}
