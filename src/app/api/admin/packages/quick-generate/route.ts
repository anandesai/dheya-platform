// Quick Package Generator API Route
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { packageService } from "@/lib/services/package.service"

// POST /api/admin/packages/quick-generate - Generate all 3 package tiers for a segment
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
    if (!body.segment) {
      return NextResponse.json(
        { error: "segment is required" },
        { status: 400 }
      )
    }

    if (!body.productName) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      )
    }

    if (!body.packages || !Array.isArray(body.packages) || body.packages.length === 0) {
      return NextResponse.json(
        { error: "packages array is required" },
        { status: 400 }
      )
    }

    // Validate each package configuration
    for (const pkg of body.packages) {
      const requiredPkgFields = ["tier", "priceINR", "durationValue", "durationType", "totalSessions", "mentorLevel", "phases"]
      for (const field of requiredPkgFields) {
        if (pkg[field] === undefined) {
          return NextResponse.json(
            { error: `Missing required field in package: ${field}` },
            { status: 400 }
          )
        }
      }
    }

    const packages = await packageService.quickGeneratePackages(body)
    return NextResponse.json(packages, { status: 201 })
  } catch (error) {
    console.error("Error generating packages:", error)

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "One or more packages with these codes already exist" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate packages" },
      { status: 500 }
    )
  }
}
