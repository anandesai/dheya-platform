/**
 * Meeting Service - Video Meeting Integration
 *
 * Purpose: Abstract meeting provider interface for video conferencing
 * Current: Jitsi Meet (free, no account needed)
 * Future: Zoom, Google Meet, Microsoft Teams integration
 */

import { Booking } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// Meeting Provider Interface
export interface MeetingProvider {
  name: string
  createMeeting(booking: BookingWithRelations): Promise<MeetingDetails>
  getMeetingDetails(meetingId: string): Promise<MeetingDetails>
  updateMeeting?(meetingId: string, updates: MeetingUpdate): Promise<MeetingDetails>
  deleteMeeting?(meetingId: string): Promise<void>
}

// Meeting Types
export interface MeetingDetails {
  meetingId: string
  meetingUrl: string
  providerName: string
  passcode?: string
  startTime: Date
  duration: number
  metadata?: Record<string, unknown>
}

export interface MeetingUpdate {
  startTime?: Date
  duration?: number
  title?: string
}

export interface BookingWithRelations extends Booking {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  mentor: {
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
    }
  }
  package: {
    productName: string
  }
}

/**
 * Jitsi Meet Provider
 * Free, open-source, no account required
 * Perfect for MVP and prototyping
 */
class JitsiMeetProvider implements MeetingProvider {
  name = "Jitsi Meet"
  private baseUrl = "https://meet.jit.si"

  async createMeeting(booking: BookingWithRelations): Promise<MeetingDetails> {
    // Generate unique room name using booking ID and timestamp
    const roomName = this.generateRoomName(booking)
    const meetingUrl = `${this.baseUrl}/${roomName}`

    return {
      meetingId: roomName,
      meetingUrl,
      providerName: this.name,
      startTime: booking.scheduledAt,
      duration: booking.duration,
      metadata: {
        bookingId: booking.id,
        sessionNumber: booking.sessionNumber,
      },
    }
  }

  async getMeetingDetails(meetingId: string): Promise<MeetingDetails> {
    // Jitsi Meet doesn't have an API to get meeting details
    // We reconstruct the details from the meeting ID
    const meetingUrl = `${this.baseUrl}/${meetingId}`

    return {
      meetingId,
      meetingUrl,
      providerName: this.name,
      startTime: new Date(), // Would need to be stored separately
      duration: 60, // Default duration
    }
  }

  private generateRoomName(booking: BookingWithRelations): string {
    // Format: dheya-{bookingId}-{timestamp}
    // Ensures uniqueness and easy identification
    const timestamp = Date.now().toString(36)
    const bookingIdShort = booking.id.slice(-8)
    return `dheya-session-${bookingIdShort}-${timestamp}`
  }
}

/**
 * Zoom Provider (Future Implementation)
 * Requires Zoom API credentials and OAuth setup
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ZoomProvider implements MeetingProvider {
  name = "Zoom"

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createMeeting(booking: BookingWithRelations): Promise<MeetingDetails> {
    // TODO: Implement Zoom API integration
    // 1. Use Zoom REST API to create meeting
    // 2. Set meeting topic, start time, duration
    // 3. Enable waiting room, require authentication
    // 4. Return meeting URL and passcode
    throw new Error("Zoom integration not yet implemented")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMeetingDetails(meetingId: string): Promise<MeetingDetails> {
    // TODO: Implement Zoom API integration
    throw new Error("Zoom integration not yet implemented")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateMeeting(meetingId: string, updates: MeetingUpdate): Promise<MeetingDetails> {
    // TODO: Implement Zoom API integration
    throw new Error("Zoom integration not yet implemented")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteMeeting(meetingId: string): Promise<void> {
    // TODO: Implement Zoom API integration
    throw new Error("Zoom integration not yet implemented")
  }
}

/**
 * Google Meet Provider (Future Implementation)
 * Requires Google Calendar API and OAuth setup
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GoogleMeetProvider implements MeetingProvider {
  name = "Google Meet"

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createMeeting(booking: BookingWithRelations): Promise<MeetingDetails> {
    // TODO: Implement Google Calendar API integration
    // 1. Create Google Calendar event
    // 2. Add Google Meet conferencing
    // 3. Add attendees (mentor and user)
    // 4. Return meeting URL
    throw new Error("Google Meet integration not yet implemented")
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMeetingDetails(meetingId: string): Promise<MeetingDetails> {
    // TODO: Implement Google Calendar API integration
    throw new Error("Google Meet integration not yet implemented")
  }
}

/**
 * Meeting Service
 * Main service for managing video meetings
 */
export const meetingService = {
  // Current provider (can be switched via config)
  defaultProvider: new JitsiMeetProvider() as MeetingProvider,

  /**
   * Create or get meeting URL for a booking
   * If booking already has a meeting URL, return it
   * Otherwise, create a new meeting and update booking
   */
  async getOrCreateMeetingUrl(bookingId: string): Promise<string> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        package: {
          select: {
            productName: true,
          },
        },
      },
    })

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Return existing meeting URL if available
    if (booking.meetingUrl) {
      return booking.meetingUrl
    }

    // Create new meeting
    const meetingDetails = await this.defaultProvider.createMeeting(booking)

    // Update booking with meeting URL
    await prisma.booking.update({
      where: { id: bookingId },
      data: { meetingUrl: meetingDetails.meetingUrl },
    })

    return meetingDetails.meetingUrl
  },

  /**
   * Generate meeting URL for a new booking
   * Called during booking creation
   */
  async generateMeetingUrl(booking: BookingWithRelations): Promise<string> {
    const meetingDetails = await this.defaultProvider.createMeeting(booking)
    return meetingDetails.meetingUrl
  },

  /**
   * Get meeting details by booking ID
   */
  async getMeetingDetailsByBooking(bookingId: string): Promise<MeetingDetails | null> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        package: {
          select: {
            productName: true,
          },
        },
      },
    })

    if (!booking || !booking.meetingUrl) {
      return null
    }

    // Extract meeting ID from URL
    const meetingId = this.extractMeetingId(booking.meetingUrl)

    if (!meetingId) {
      return null
    }

    return {
      meetingId,
      meetingUrl: booking.meetingUrl,
      providerName: this.defaultProvider.name,
      startTime: booking.scheduledAt,
      duration: booking.duration,
      metadata: {
        bookingId: booking.id,
        sessionNumber: booking.sessionNumber,
      },
    }
  },

  /**
   * Extract meeting ID from meeting URL
   */
  extractMeetingId(meetingUrl: string): string | null {
    try {
      const url = new URL(meetingUrl)
      const pathname = url.pathname
      const segments = pathname.split("/").filter(Boolean)
      return segments[segments.length - 1] || null
    } catch {
      return null
    }
  },

  /**
   * Validate meeting URL
   */
  isValidMeetingUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      const validHosts = ["meet.jit.si", "zoom.us", "meet.google.com"]
      return validHosts.some((host) => parsedUrl.hostname.includes(host))
    } catch {
      return false
    }
  },

  /**
   * Switch provider (for future multi-provider support)
   */
  setProvider(provider: MeetingProvider): void {
    this.defaultProvider = provider
  },

  /**
   * Get available providers
   */
  getAvailableProviders(): { name: string; available: boolean }[] {
    return [
      { name: "Jitsi Meet", available: true },
      { name: "Zoom", available: false },
      { name: "Google Meet", available: false },
    ]
  },
}
