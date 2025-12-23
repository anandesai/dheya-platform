// Package Publish/Unpublish API Route
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/admin/packages/[id]/publish - Publish a package
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

    const pkg = await packageService.publishPackage(id)
    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error publishing package:", error)
    return NextResponse.json(
      { error: "Failed to publish package" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/packages/[id]/publish - Unpublish a package
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

    const pkg = await packageService.unpublishPackage(id)
    return NextResponse.json(pkg)
  } catch (error) {
    console.error("Error unpublishing package:", error)
    return NextResponse.json(
      { error: "Failed to unpublish package" },
      { status: 500 }
    )
  }
}
