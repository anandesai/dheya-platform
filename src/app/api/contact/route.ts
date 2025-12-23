import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  segment: z.string().min(1, "Please select a segment"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = contactSchema.parse(body)

    // TODO: Implement actual email sending or database storage
    // For now, we'll just log the contact form submission
    console.log("Contact form submission received:", {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      segment: validatedData.segment,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user
    // TODO: Store in database for follow-up

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      )
    }

    console.error("Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
