// Package Management API Routes
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"
import { UserSegment, PackageTier } from "@prisma/client"

// GET /api/admin/packages - Get all packages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const segment = searchParams.get("segment") as UserSegment | null
    const tier = searchParams.get("tier") as PackageTier | null
    const isActive = searchParams.get("isActive")
    const isPublished = searchParams.get("isPublished")
    const groupBySegment = searchParams.get("groupBySegment") === "true"

    if (groupBySegment) {
      const packagesBySegment = await packageService.getPackagesBySegment()
      return NextResponse.json(packagesBySegment)
    }

    const filters = {
      segment: segment || undefined,
      tier: tier || undefined,
      isActive: isActive !== null ? isActive === "true" : undefined,
      isPublished: isPublished !== null ? isPublished === "true" : undefined
    }

    const packages = await packageService.getPackages(filters)
    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    )
  }
}

// POST /api/admin/packages - Create a new package
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "code",
      "segment",
      "tier",
      "productName",
      "packageName",
      "description",
      "priceINR",
      "durationValue",
      "durationType",
      "totalSessions",
      "sessionFrequency",
      "mentorLevel",
      "phases"
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const pkg = await packageService.createPackage(body)
    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Package with this code already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    )
  }
}
