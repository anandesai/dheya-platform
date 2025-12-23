// Package Management API Routes - Individual Package Operations
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/packages/[id] - Get a specific package
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pkg = await packageService.getPackageById(id)

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/packages/[id] - Update a package
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    // Check if package exists
    const existing = await packageService.getPackageById(id)
    if (!existing) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    const pkg = await packageService.updatePackage(id, body)
    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/packages/[id] - Delete a package
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get("hard") === "true"

    await packageService.deletePackage(id, hardDelete)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)

    if (error instanceof Error && error.message.includes("active users")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    )
  }
}
