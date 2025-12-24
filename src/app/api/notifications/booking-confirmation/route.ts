import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { format } from "date-fns"

// Email notification schema
const emailNotificationSchema = z.object({
  bookingId: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().min(1),
  mentorName: z.string().min(1),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(30),
  meetingUrl: z.string().url().optional(),
  notes: z.string().optional(),
})

type EmailNotificationData = z.infer<typeof emailNotificationSchema>

/**
 * Generates HTML email template for booking confirmation
 */
function generateEmailTemplate(data: EmailNotificationData): string {
  const scheduledDate = new Date(data.scheduledAt)
  const endTime = new Date(scheduledDate.getTime() + data.duration * 60000)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Confirmed - Dheya Career Mentors</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
        ✓ Your Session is Confirmed!
      </h1>
      <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
        We're excited to see you grow with Dheya
      </p>
    </div>

    <!-- Content -->
    <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

      <!-- Greeting -->
      <p style="margin: 0 0 20px; font-size: 16px; color: #1f2937;">
        Hi ${data.recipientName},
      </p>

      <p style="margin: 0 0 30px; font-size: 16px; color: #1f2937;">
        Your mentoring session has been successfully scheduled. Here are the details:
      </p>

      <!-- Session Details Card -->
      <div style="background-color: #f3f4f6; border-left: 4px solid #8B5CF6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">

        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
            Mentor
          </p>
          <p style="margin: 0; font-size: 18px; color: #1f2937; font-weight: 600;">
            ${data.mentorName}
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
            Date & Time
          </p>
          <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 500;">
            📅 ${format(scheduledDate, "EEEE, MMMM d, yyyy")}
          </p>
          <p style="margin: 5px 0 0; font-size: 16px; color: #1f2937; font-weight: 500;">
            ⏰ ${format(scheduledDate, "h:mm a")} - ${format(endTime, "h:mm a")}
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
            Duration
          </p>
          <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 500;">
            ${data.duration} minutes
          </p>
        </div>

        ${data.meetingUrl ? `
        <div style="margin-bottom: 0;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
            Meeting Link
          </p>
          <a href="${data.meetingUrl}" style="display: inline-block; padding: 10px 20px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 5px;">
            Join Meeting
          </a>
        </div>
        ` : ''}

        ${data.notes ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
            Your Notes
          </p>
          <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
            ${data.notes}
          </p>
        </div>
        ` : ''}
      </div>

      <!-- Add to Calendar Section -->
      <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #78350f; font-weight: 600;">
          📆 Don't forget to add this to your calendar!
        </p>
        <p style="margin: 0; font-size: 13px; color: #92400e;">
          Click the "Add to Calendar" button in your dashboard to sync this session with your calendar app.
        </p>
      </div>

      <!-- Preparation Tips -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px; font-size: 18px; color: #1f2937; font-weight: 600;">
          Preparing for Your Session
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
          <li>Review your career goals and questions beforehand</li>
          <li>Have a quiet space ready for the call</li>
          <li>Test your audio and video connection</li>
          <li>Bring any materials you'd like to discuss</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${process.env.NEXTAUTH_URL}/sessions" style="display: inline-block; padding: 14px 32px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          View All Sessions
        </a>
      </div>

      <!-- Footer Message -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
          Need to reschedule? Visit your dashboard or contact us at
          <a href="mailto:support@dheya.com" style="color: #8B5CF6; text-decoration: none;">support@dheya.com</a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          Booking ID: ${data.bookingId}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="margin: 0 0 10px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        Empowering careers, one session at a time.
      </p>
    </div>

  </div>
</body>
</html>
  `
}

/**
 * Sends booking confirmation email
 * This is a placeholder implementation - integrate with your email service
 */
async function sendBookingConfirmationEmail(
  data: EmailNotificationData
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const emailHtml = generateEmailTemplate(data) // Reserved for email service integration
    const emailText = `
Hi ${data.recipientName},

Your mentoring session has been successfully scheduled!

Session Details:
- Mentor: ${data.mentorName}
- Date: ${format(new Date(data.scheduledAt), "EEEE, MMMM d, yyyy")}
- Time: ${format(new Date(data.scheduledAt), "h:mm a")}
- Duration: ${data.duration} minutes
${data.meetingUrl ? `- Meeting Link: ${data.meetingUrl}` : ""}
${data.notes ? `\nYour Notes:\n${data.notes}` : ""}

Booking ID: ${data.bookingId}

Don't forget to add this to your calendar!

Best regards,
Dheya Career Mentors Team
    `.trim()

    // TODO: Integrate with email service (SendGrid, AWS SES, Resend, etc.)
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: data.recipientEmail,
    //   from: 'noreply@dheya.com',
    //   subject: `Session Confirmed - ${format(new Date(data.scheduledAt), "MMM d, yyyy")}`,
    //   text: emailText,
    //   html: emailHtml,
    // })

    // For now, just log the email details
    console.log("📧 Booking Confirmation Email")
    console.log("To:", data.recipientEmail)
    console.log("Subject:", `Session Confirmed - ${format(new Date(data.scheduledAt), "MMM d, yyyy")}`)
    console.log("Booking ID:", data.bookingId)
    console.log("\n--- Email Preview ---")
    console.log(emailText)
    console.log("--- End Preview ---\n")

    return true
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error)
    return false
  }
}

/**
 * POST /api/notifications/booking-confirmation
 * Sends a booking confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = emailNotificationSchema.parse(body)

    const success = await sendBookingConfirmationEmail(validatedData)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Confirmation email sent successfully",
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error sending booking confirmation:", error)
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    )
  }
}
