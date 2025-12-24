import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/webhooks/meeting
 * Webhook endpoint for meeting provider events
 *
 * Supports:
 * - Zoom webhooks
 * - Google Meet webhooks
 * - Jitsi Meet webhooks (future)
 *
 * Events:
 * - meeting.started
 * - meeting.ended
 * - participant.joined
 * - participant.left
 * - recording.completed
 */

interface MeetingWebhookEvent {
  provider: "zoom" | "google-meet" | "jitsi"
  event: "meeting.started" | "meeting.ended" | "participant.joined" | "participant.left"
  payload: {
    meetingId: string
    timestamp: string
    participantEmail?: string
    duration?: number
    recordingUrl?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature (implement based on provider)
    const signature = req.headers.get("x-webhook-signature")
    const provider = req.headers.get("x-provider") as "zoom" | "google-meet" | "jitsi"

    if (!signature || !provider) {
      return NextResponse.json(
        { error: "Missing webhook signature or provider" },
        { status: 400 }
      )
    }

    // Verify signature based on provider
    const isValid = await verifyWebhookSignature(provider, signature, req)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse webhook payload
    const event: MeetingWebhookEvent = await req.json()

    // Handle event based on type
    switch (event.event) {
      case "meeting.started":
        await handleMeetingStarted(event)
        break

      case "meeting.ended":
        await handleMeetingEnded(event)
        break

      case "participant.joined":
        await handleParticipantJoined(event)
        break

      case "participant.left":
        await handleParticipantLeft(event)
        break

      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing meeting webhook:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

/**
 * Verify webhook signature based on provider
 */
async function verifyWebhookSignature(
  provider: string,
  signature: string,
  req: NextRequest
): Promise<boolean> {
  // TODO: Implement signature verification for each provider
  // Zoom: HMAC SHA256 with secret token
  // Google Meet: JWT verification
  // For now, accept all webhooks in development

  if (process.env.NODE_ENV === "development") {
    return true
  }

  switch (provider) {
    case "zoom":
      return verifyZoomSignature(signature, req)
    case "google-meet":
      return verifyGoogleMeetSignature(signature, req)
    case "jitsi":
      return verifyJitsiSignature(signature, req)
    default:
      return false
  }
}

/**
 * Verify Zoom webhook signature
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyZoomSignature(signature: string, req: NextRequest): Promise<boolean> {
  // TODO: Implement Zoom webhook signature verification
  // Reference: https://marketplace.zoom.us/docs/api-reference/webhook-reference/
  return true
}

/**
 * Verify Google Meet webhook signature
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyGoogleMeetSignature(signature: string, req: NextRequest): Promise<boolean> {
  // TODO: Implement Google Meet webhook signature verification
  return true
}

/**
 * Verify Jitsi webhook signature
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyJitsiSignature(signature: string, req: NextRequest): Promise<boolean> {
  // TODO: Implement Jitsi webhook signature verification
  return true
}

/**
 * Handle meeting started event
 */
async function handleMeetingStarted(event: MeetingWebhookEvent) {
  console.log("Meeting started:", event.payload.meetingId)

  // Find booking by meeting URL
  const booking = await prisma.booking.findFirst({
    where: {
      meetingUrl: {
        contains: event.payload.meetingId,
      },
      status: "SCHEDULED",
    },
  })

  if (!booking) {
    console.log("Booking not found for meeting:", event.payload.meetingId)
    return
  }

  // Update booking status (optional: track actual start time)
  // Could add a custom field for actualStartTime
  console.log("Booking found:", booking.id, "- Meeting started")
}

/**
 * Handle meeting ended event
 */
async function handleMeetingEnded(event: MeetingWebhookEvent) {
  console.log("Meeting ended:", event.payload.meetingId)

  // Find booking by meeting URL
  const booking = await prisma.booking.findFirst({
    where: {
      meetingUrl: {
        contains: event.payload.meetingId,
      },
      status: "SCHEDULED",
    },
  })

  if (!booking) {
    console.log("Booking not found for meeting:", event.payload.meetingId)
    return
  }

  // Auto-complete the booking
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "COMPLETED",
      // Could store actual duration from webhook
      // actualDuration: event.payload.duration
    },
  })

  console.log("Booking completed:", booking.id)
}

/**
 * Handle participant joined event
 */
async function handleParticipantJoined(event: MeetingWebhookEvent) {
  console.log("Participant joined:", event.payload.participantEmail)
  // Could track participant join times for analytics
}

/**
 * Handle participant left event
 */
async function handleParticipantLeft(event: MeetingWebhookEvent) {
  console.log("Participant left:", event.payload.participantEmail)
  // Could track participant leave times for analytics
}

/**
 * GET /api/webhooks/meeting
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Meeting webhook endpoint is active",
    supported_providers: ["zoom", "google-meet", "jitsi"],
  })
}
