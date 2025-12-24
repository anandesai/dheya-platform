import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { answers } = body

        // Calculate score on server side to verify
        const verifiedScore = Object.values(answers).filter(Boolean).length

        // Find or create the Tool record
        const tool = await prisma.tool.upsert({
            where: { code: "BBD_ASSESSMENT" },
            update: {},
            create: {
                code: "BBD_ASSESSMENT",
                name: "BBD Syndrome Assessment",
                shortDescription: "Bored, Burned out, Dissatisfied Assessment",
                longDescription: "A diagnostic tool to assess mid-career burnout levels.",
                category: "ASSESSMENT",
                contentSchema: {},
                contentData: {},
                version: "1.0",
            },
        })

        // Create the result
        const result = await prisma.toolResult.create({
            data: {
                userId: session.user.id,
                toolId: tool.id,
                responses: answers as Record<string, boolean>, // Cast to strict type
                scores: {
                    total: verifiedScore,
                    max: 25,
                    percentage: (verifiedScore / 25) * 100
                },
                reportGenerated: true,
            },
        })

        return NextResponse.json({ success: true, resultId: result.id })
    } catch (error) {
        console.error("Error saving BBD assessment:", error)
        return NextResponse.json(
            { error: "Failed to save assessment" },
            { status: 500 }
        )
    }
}
