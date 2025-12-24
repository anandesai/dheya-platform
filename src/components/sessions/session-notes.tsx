"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Save, Clock } from "lucide-react"

interface SessionNotesProps {
  bookingId: string
  isEditable?: boolean
  initialNotes?: string | null
  className?: string
}

// Note: NoteEntry interface reserved for future structured notes feature
// interface NoteEntry {
//   content: string
//   timestamp: Date
// }

export function SessionNotes({
  bookingId,
  isEditable = true,
  initialNotes = "",
  className
}: SessionNotesProps) {
  const [notes, setNotes] = React.useState(initialNotes || "")
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle")

  const saveTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Auto-save to localStorage
  React.useEffect(() => {
    if (!isEditable) return

    const localKey = `session-notes-${bookingId}`
    localStorage.setItem(localKey, notes)
  }, [notes, bookingId, isEditable])

  // Debounced save to API
  React.useEffect(() => {
    if (!isEditable) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (notes !== initialNotes) {
      setSaveStatus("saving")
      saveTimeoutRef.current = setTimeout(() => {
        saveToAPI()
      }, 2000) // 2 second debounce
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [notes, isEditable, bookingId, initialNotes])

  const saveToAPI = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      const response = await fetch(`/api/sessions/${bookingId}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to save notes")
      }

      setLastSaved(new Date())
      setSaveStatus("saved")

      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Error saving notes:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveToAPI()
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving..."
      case "saved":
        return "Saved"
      case "error":
        return "Error saving"
      default:
        return lastSaved ? `Last saved ${formatTimestamp(lastSaved)}` : ""
    }
  }

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case "saving":
        return "text-purple-500"
      case "saved":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card variant="light" className={cn("overflow-hidden", className)}>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">Session Notes</CardTitle>
            <CardDescription>
              {isEditable
                ? "Take notes during your session"
                : "View session notes"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {isEditable && saveStatus !== "idle" && (
              <div className={cn("flex items-center gap-2 text-xs font-medium", getSaveStatusColor())}>
                {saveStatus === "saving" && (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                )}
                {saveStatus === "saved" && (
                  <Clock className="h-3 w-3" />
                )}
                <span>{getSaveStatusText()}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {isEditable ? (
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about the session, key takeaways, action items, or follow-up questions..."
                  className="min-h-[200px] resize-y font-body text-sm focus-visible:ring-purple-500"
                  disabled={!isEditable}
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Notes are auto-saved as you type
                  </p>

                  <Button
                    variant="uplift"
                    size="sm"
                    onClick={handleManualSave}
                    disabled={isSaving || notes === initialNotes}
                    className="gap-2"
                  >
                    <Save className="h-3 w-3" />
                    Save Now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {notes ? (
                  <div className="rounded-lg bg-cream-50 p-4 font-body text-sm text-charcoal-800 whitespace-pre-wrap">
                    {notes}
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-cream-200 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No notes were recorded for this session
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
