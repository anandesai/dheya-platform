"use client"

import { useState } from "react"
import { Bell, X, Check, Calendar, Award, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: "session" | "assessment" | "message" | "achievement" | "system"
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

const typeIcons = {
  session: Calendar,
  assessment: AlertCircle,
  message: MessageSquare,
  achievement: Award,
  system: Bell,
}

const typeColors = {
  session: "bg-purple-100 text-purple-600",
  assessment: "bg-blue-100 text-blue-600",
  message: "bg-green-100 text-green-600",
  achievement: "bg-amber-100 text-amber-600",
  system: "bg-charcoal-100 text-charcoal-600",
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "session",
    title: "Upcoming Session Tomorrow",
    description: "Your session with Dr. Priya Sharma is scheduled for tomorrow at 10:00 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    actionUrl: "/sessions",
  },
  {
    id: "2",
    type: "assessment",
    title: "Assessment Reminder",
    description: "Complete your BBD Assessment to unlock personalized insights",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: "/assessments/bbd-assessment",
  },
  {
    id: "3",
    type: "achievement",
    title: "Milestone Achieved!",
    description: "Congratulations! You've completed Phase 1 of your career journey",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: "/progress",
  },
  {
    id: "4",
    type: "message",
    title: "New Message from Mentor",
    description: "Your mentor has shared resources for your next session",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Profile Incomplete",
    description: "Complete your profile to get personalized recommendations",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    actionUrl: "/settings",
  },
]

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-charcoal-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-display font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 bg-white border-cream-200">
        <div className="flex items-center justify-between p-4 border-b border-cream-200">
          <h3 className="font-display font-semibold text-charcoal-800">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-10 w-10 text-charcoal-300 mb-3" />
              <p className="font-display text-sm text-charcoal-600">
                No notifications
              </p>
              <p className="font-body text-xs text-charcoal-500 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-cream-50 transition-colors cursor-pointer relative group",
                      !notification.read && "bg-purple-50/50"
                    )}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                          typeColors[notification.type]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "font-display text-sm",
                              notification.read
                                ? "text-charcoal-700"
                                : "text-charcoal-900 font-medium"
                            )}
                          >
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-cream-200 rounded"
                          >
                            <X className="h-3 w-3 text-charcoal-400" />
                          </button>
                        </div>
                        <p className="font-body text-xs text-charcoal-600 mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="font-body text-xs text-charcoal-400 mt-2">
                          {formatRelativeTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-cream-200 bg-cream-50">
          <Button
            variant="ghost"
            className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Notification preferences component for Settings page
export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    sessionReminders: true,
    assessmentReminders: true,
    mentorMessages: true,
    achievements: true,
    systemUpdates: false,
    emailNotifications: true,
    pushNotifications: true,
  })

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    {
      key: "sessionReminders" as const,
      title: "Session Reminders",
      description: "Get notified about upcoming mentoring sessions",
    },
    {
      key: "assessmentReminders" as const,
      title: "Assessment Reminders",
      description: "Reminders to complete pending assessments",
    },
    {
      key: "mentorMessages" as const,
      title: "Mentor Messages",
      description: "Notifications when your mentor sends you a message",
    },
    {
      key: "achievements" as const,
      title: "Achievements",
      description: "Celebrate your milestones and progress",
    },
    {
      key: "systemUpdates" as const,
      title: "System Updates",
      description: "Platform updates and new features",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3 border-b border-cream-200 last:border-0"
          >
            <div>
              <p className="font-display text-sm font-medium text-charcoal-800">
                {item.title}
              </p>
              <p className="font-body text-xs text-charcoal-600 mt-0.5">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                preferences[item.key] ? "bg-purple-500" : "bg-charcoal-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  preferences[item.key] && "translate-x-5"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-cream-200">
        <h4 className="font-display text-sm font-medium text-charcoal-800 mb-4">
          Delivery Channels
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Email
              </Badge>
              <span className="font-body text-sm text-charcoal-600">
                Receive notifications via email
              </span>
            </div>
            <button
              onClick={() => handleToggle("emailNotifications")}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                preferences.emailNotifications ? "bg-purple-500" : "bg-charcoal-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  preferences.emailNotifications && "translate-x-5"
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Push
              </Badge>
              <span className="font-body text-sm text-charcoal-600">
                Browser push notifications
              </span>
            </div>
            <button
              onClick={() => handleToggle("pushNotifications")}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                preferences.pushNotifications ? "bg-purple-500" : "bg-charcoal-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  preferences.pushNotifications && "translate-x-5"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
