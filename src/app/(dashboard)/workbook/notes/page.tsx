"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SessionNotes } from "@/components/sessions/session-notes"

export default function SessionNotesPage() {
    // In a real app, we would fetch the current booking/session ID.
    // For now, we'll use a placeholder or potentially list past sessions.
    // Since the SessionNotes component takes a bookingId, we will simulate one.
    const currentSessionId = "workbook-general-notes"

    return (
        <div className="container-uplift space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/workbook">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5 text-charcoal-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="heading-pagetitle text-charcoal-900">Session Notes</h1>
                    <p className="body-large text-charcoal-600">Module 9 of 9</p>
                </div>
            </div>

            <div className="mt-6 max-w-3xl">
                <SessionNotes
                    bookingId={currentSessionId}
                    isEditable={true}
                    initialNotes=""
                />

                <p className="text-sm text-charcoal-500 mt-4 px-1">
                    These notes are shared between you and your mentor. Use this space to track key takeaways, action items, and questions for your next session.
                </p>
            </div>
        </div>
    )
}
