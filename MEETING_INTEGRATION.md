# Video Meeting Integration - Dheya Career Mentors Platform

Complete video conferencing integration for mentoring sessions with support for multiple providers.

## Overview

The meeting integration provides a seamless video conferencing experience for mentor-mentee sessions with:

- **Provider Abstraction**: Support for multiple meeting providers (Jitsi Meet, Zoom, Google Meet)
- **Auto-Generation**: Meeting URLs automatically created when bookings are made
- **Pre-Meeting Checklist**: Ensures participants are ready before joining
- **Meeting Room UI**: Clean, focused interface with session information
- **Webhook Support**: Provider webhooks for automatic session status updates
- **Feedback Collection**: Post-session feedback and ratings

## Current Implementation: Jitsi Meet (MVP)

For the MVP, we use **Jitsi Meet** as the default provider:
- **No Account Required**: Free, open-source solution
- **No API Keys**: No setup or credentials needed
- **Instant Meetings**: Generate URLs immediately
- **Reliable**: Proven open-source video conferencing

### Why Jitsi Meet for MVP?

1. **Zero Setup**: No API keys, accounts, or OAuth configuration
2. **Cost-Free**: Completely free for unlimited usage
3. **Privacy**: Open-source with good privacy practices
4. **Quality**: Enterprise-grade video/audio quality
5. **Features**: Screen sharing, chat, recording capabilities

## Architecture

### Service Layer

**`/src/lib/services/meeting.service.ts`**

Abstract meeting provider interface with multiple implementations:

```typescript
interface MeetingProvider {
  name: string
  createMeeting(booking): Promise<MeetingDetails>
  getMeetingDetails(meetingId): Promise<MeetingDetails>
  updateMeeting?(meetingId, updates): Promise<MeetingDetails>
  deleteMeeting?(meetingId): Promise<void>
}
```

**Current Providers:**
- ✅ `JitsiMeetProvider` - Active (MVP)
- 🚧 `ZoomProvider` - Placeholder
- 🚧 `GoogleMeetProvider` - Placeholder

### Meeting URL Generation

Meeting URLs are auto-generated when bookings are created:

```typescript
// In booking.service.ts
const meetingUrl = await meetingService.generateMeetingUrl(booking)
await prisma.booking.update({
  where: { id: booking.id },
  data: { meetingUrl }
})
```

**Jitsi URL Format:**
```
https://meet.jit.si/dheya-session-{bookingId}-{timestamp}
```

### Pages

#### 1. Meeting Room Page
**`/sessions/[sessionId]/meeting`**

Full-screen meeting interface with:
- Pre-meeting checklist (audio, video, goals)
- Session information sidebar
- Meeting timer
- End session button
- Meeting window launcher

**Pre-Meeting Checklist:**
```typescript
const checklist = {
  audio: false,    // Check microphone and speakers
  video: false,    // Check camera positioning
  goals: false,    // Review session objectives
}
```

**Features:**
- Collapsible sidebar with participant info
- Session duration timer
- Quick tips for better meetings
- Clean, distraction-free design

#### 2. Feedback Page
**`/sessions/[sessionId]/feedback`**

Post-session feedback collection:
- 5-star rating system
- Optional comments
- Automatic mentor rating updates

### API Routes

#### GET `/api/sessions/[sessionId]/meeting`
Get or create meeting details for a session

**Response:**
```json
{
  "booking": {
    "id": "booking-id",
    "sessionNumber": 1,
    "scheduledAt": "2024-01-15T10:00:00Z",
    "duration": 60,
    "notes": "Career transition discussion",
    "status": "SCHEDULED",
    "meetingUrl": "https://meet.jit.si/dheya-session-abc123-xyz"
  },
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "mentor": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "package": {
    "name": "Destination Mastery"
  }
}
```

#### POST `/api/sessions/[sessionId]/complete`
Mark a session as completed

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-id",
    "status": "COMPLETED"
  }
}
```

#### POST `/api/sessions/[sessionId]/feedback`
Submit session feedback

**Request:**
```json
{
  "rating": 5,
  "comment": "Excellent session, very helpful insights"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-id",
    "feedback": {
      "rating": 5,
      "comment": "Excellent session, very helpful insights"
    }
  }
}
```

#### POST `/api/webhooks/meeting`
Webhook endpoint for meeting provider events

**Supported Events:**
- `meeting.started` - Meeting begins
- `meeting.ended` - Meeting completes (auto-updates booking status)
- `participant.joined` - Participant joins
- `participant.left` - Participant leaves

**Request Headers:**
```
x-webhook-signature: <signature>
x-provider: zoom|google-meet|jitsi
```

## User Flow

### 1. Booking Creation
```
User books session
  → Booking created with SCHEDULED status
  → Meeting URL auto-generated (Jitsi Meet)
  → meetingUrl stored in booking record
```

### 2. Pre-Meeting
```
User clicks "Join Meeting"
  → Redirected to /sessions/[id]/meeting
  → Pre-meeting checklist displayed
  → User checks audio, video, goals
  → User clicks "Join Meeting"
```

### 3. During Meeting
```
Meeting opens in new window (Jitsi Meet)
  → User participates in video call
  → Session timer running
  → Sidebar shows participant info
  → Meeting window can be reopened if closed
```

### 4. Post-Meeting
```
User clicks "End Session"
  → Confirmation dialog
  → Booking status → COMPLETED
  → Redirected to feedback page
  → User submits rating and comments
  → Mentor rating automatically updated
```

## Database Schema

The `Booking` model includes meeting integration fields:

```prisma
model Booking {
  id            String        @id @default(cuid())
  userId        String
  mentorId      String
  packageId     String
  sessionNumber Int
  scheduledAt   DateTime
  duration      Int           @default(60)
  status        BookingStatus @default(SCHEDULED)
  meetingUrl    String?       // Auto-generated meeting URL
  notes         String?       @db.Text
  feedback      Json?         // { rating: number, comment: string }
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

## Future Enhancements

### Zoom Integration

**Requirements:**
1. Zoom App credentials (Client ID, Client Secret)
2. OAuth 2.0 setup for user authorization
3. Zoom Meeting API integration

**Implementation:**
```typescript
class ZoomProvider implements MeetingProvider {
  async createMeeting(booking) {
    // POST https://api.zoom.us/v2/users/me/meetings
    // Set topic, start_time, duration
    // Return join_url and passcode
  }
}
```

**Benefits:**
- Waiting room support
- Cloud recording
- Advanced controls
- Better analytics

### Google Meet Integration

**Requirements:**
1. Google Cloud Project setup
2. Google Calendar API enabled
3. OAuth 2.0 credentials
4. Google Meet add-on enabled

**Implementation:**
```typescript
class GoogleMeetProvider implements MeetingProvider {
  async createMeeting(booking) {
    // Create Calendar event with conferencing
    // Add mentor and user as attendees
    // Return meeting URL from event
  }
}
```

**Benefits:**
- Calendar integration
- Email invitations
- Google Workspace features
- Familiar interface

### Advanced Features

1. **In-App Meeting (Future)**
   - Embed Jitsi Meet iframe directly in the page
   - Custom branding and controls
   - Recording management
   - Screen sharing controls

2. **Meeting Recording**
   - Automatic cloud recording
   - Recording storage and retrieval
   - Transcription services
   - Playback interface

3. **Meeting Analytics**
   - Duration tracking
   - Attendance verification
   - Participant engagement metrics
   - Quality of service metrics

4. **Calendar Integration**
   - Sync with Google Calendar
   - Automatic reminders
   - Rescheduling support
   - Timezone management

5. **Advanced Notifications**
   - Email reminders (24h, 1h before)
   - SMS notifications
   - Push notifications
   - Meeting link in emails

## Configuration

### Environment Variables

```env
# Meeting Provider Configuration
MEETING_PROVIDER=jitsi  # jitsi|zoom|google-meet
JITSI_DOMAIN=meet.jit.si
JITSI_ROOM_PREFIX=dheya-session

# Zoom (Future)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_WEBHOOK_SECRET=your_webhook_secret

# Google Meet (Future)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_API_KEY=your_api_key
```

### Switching Providers

```typescript
// In meeting.service.ts
import { ZoomProvider } from './providers/zoom'

// Switch provider
meetingService.setProvider(new ZoomProvider())
```

## Security Considerations

### Meeting URL Security

1. **Unique URLs**: Each meeting has a unique, unpredictable URL
2. **Time-Limited**: URLs are only valid for scheduled session time
3. **Access Control**: Only mentor and user have access
4. **No Guessing**: Includes random timestamp component

### Webhook Security

1. **Signature Verification**: Validate webhook signatures
2. **HTTPS Only**: Webhooks only accepted over HTTPS
3. **Idempotency**: Handle duplicate webhook events
4. **Rate Limiting**: Prevent webhook flooding

### Data Privacy

1. **No Recording Storage**: Jitsi Meet doesn't store recordings by default
2. **End-to-End Options**: Can enable E2E encryption in Jitsi
3. **Data Minimization**: Only store essential meeting metadata
4. **GDPR Compliance**: Follow data protection regulations

## Testing

### Manual Testing

1. **Create Booking**: Create a new booking via UI
2. **Verify URL**: Check that `meetingUrl` is populated
3. **Join Meeting**: Click "Join Meeting" and complete checklist
4. **Test Meeting**: Verify video/audio in Jitsi Meet
5. **End Session**: Click "End Session" and verify status update
6. **Submit Feedback**: Provide rating and comments

### Automated Testing (Future)

```typescript
// Example test
describe('Meeting Integration', () => {
  it('should generate meeting URL on booking creation', async () => {
    const booking = await bookingService.createBooking({
      userId: 'user-id',
      mentorId: 'mentor-id',
      packageId: 'package-id',
      scheduledAt: new Date(),
    })

    expect(booking.meetingUrl).toBeTruthy()
    expect(booking.meetingUrl).toContain('meet.jit.si')
  })
})
```

## Troubleshooting

### Meeting URL Not Generated

**Issue**: Booking created without `meetingUrl`

**Solutions:**
1. Check meeting service logs for errors
2. Verify `meetingService.generateMeetingUrl()` is called
3. Check database transaction completion
4. Manually regenerate URL: `meetingService.getOrCreateMeetingUrl(bookingId)`

### Meeting Won't Open

**Issue**: Clicking "Join Meeting" doesn't open window

**Solutions:**
1. Check browser popup blocker
2. Verify meeting URL is valid
3. Check CORS settings for Jitsi Meet
4. Use "Reopen Meeting Window" button

### Webhook Not Received

**Issue**: Provider webhooks not updating booking status

**Solutions:**
1. Verify webhook URL is publicly accessible
2. Check webhook signature verification
3. Review webhook logs for errors
4. Test webhook manually with tools like Postman

## Support

For issues or questions:
1. Check this documentation
2. Review service logs
3. Test meeting URL manually
4. Contact platform support

## License

Meeting integration is part of the Dheya Career Mentors Platform.
Uses open-source Jitsi Meet under Apache 2.0 license.
