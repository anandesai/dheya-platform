import { format } from "date-fns"

interface BookingDetails {
  id: string
  scheduledAt: Date
  duration: number
  mentor: {
    name: string
  }
  notes?: string | null
  meetingUrl?: string | null
}

/**
 * Generates a Google Calendar event URL for a booking
 */
export function generateGoogleCalendarUrl(booking: BookingDetails): string {
  const { scheduledAt, duration, mentor, notes, meetingUrl } = booking

  const startTime = new Date(scheduledAt)
  const endTime = new Date(startTime.getTime() + duration * 60000)

  const formatDateTime = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss")
  }

  const title = encodeURIComponent(`Dheya Mentoring Session with ${mentor.name}`)
  const description = encodeURIComponent(
    [
      "Dheya Career Mentors Platform",
      "",
      meetingUrl ? `Meeting URL: ${meetingUrl}` : "",
      notes ? `Notes: ${notes}` : "",
      "",
      "Booking ID: " + booking.id,
    ]
      .filter(Boolean)
      .join("\n")
  )

  const dates = `${formatDateTime(startTime)}/${formatDateTime(endTime)}`
  const location = meetingUrl
    ? encodeURIComponent(meetingUrl)
    : encodeURIComponent("Online")

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: dates,
    details: description,
    location: location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generates an iCal (.ics) file content for a booking
 */
export function generateICalFile(booking: BookingDetails): string {
  const { scheduledAt, duration, mentor, notes, meetingUrl } = booking

  const startTime = new Date(scheduledAt)
  const endTime = new Date(startTime.getTime() + duration * 60000)

  const formatICalDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss")
  }

  const now = new Date()
  const timestamp = formatICalDate(now)

  const title = `Dheya Mentoring Session with ${mentor.name}`
  const description = [
    "Dheya Career Mentors Platform",
    "",
    meetingUrl ? `Meeting URL: ${meetingUrl}` : "",
    notes ? `Notes: ${notes}` : "",
    "",
    "Booking ID: " + booking.id,
  ]
    .filter(Boolean)
    .join("\\n")

  const location = meetingUrl || "Online"

  // iCal format requires lines to be no longer than 75 characters
  const foldLine = (line: string) => {
    const chunks = []
    let remaining = line
    while (remaining.length > 75) {
      chunks.push(remaining.substring(0, 75))
      remaining = " " + remaining.substring(75)
    }
    chunks.push(remaining)
    return chunks.join("\r\n")
  }

  const icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dheya Career Mentors//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@dheya-platform.com`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${formatICalDate(startTime)}`,
    `DTEND:${formatICalDate(endTime)}`,
    foldLine(`SUMMARY:${title}`),
    foldLine(`DESCRIPTION:${description}`),
    foldLine(`LOCATION:${location}`),
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Mentoring session in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return icalContent
}

/**
 * Downloads an iCal file for a booking
 */
export function downloadICalFile(booking: BookingDetails): void {
  const icalContent = generateICalFile(booking)
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = window.URL.createObjectURL(blob)
  link.download = `dheya-session-${booking.id}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}
