"use client"

import { WorkbookModuleCard, ModuleStatus } from "@/components/workbook/workbook-module-card"
import {
    UserCircle,
    Fingerprint,
    Brain,
    History,
    Target,
    Scale,
    Compass,
    Calculator,
    FileText
} from "lucide-react"

// This would eventually come from a database or context
const modules = [
    {
        id: "user-profile",
        title: "User Profile",
        description: "Personal details and mentor assignment information.",
        icon: UserCircle,
        status: "completed" as ModuleStatus,
        duration: "5 mins",
        href: "/workbook/profile",
    },
    {
        id: "personal-style",
        title: "Personal Style",
        description: "Understand your inherent individuality and behavioral patterns.",
        icon: Fingerprint,
        status: "in_progress" as ModuleStatus,
        duration: "15 mins",
        href: "/workbook/style",
    },
    {
        id: "personality-traits",
        title: "Personality Traits",
        description: "Detailed analysis of your personality dimensions.",
        icon: Brain,
        status: "not_started" as ModuleStatus,
        duration: "20 mins",
        href: "/workbook/traits",
    },
    {
        id: "life-stages",
        title: "Life Stages Timeline",
        description: "Map your life journey, roles, and readiness scores.",
        icon: History,
        status: "not_started" as ModuleStatus,
        duration: "30 mins",
        href: "/workbook/life-stages",
    },
    {
        id: "life-goals",
        title: "Life Goals Tracker",
        description: "Set and track goals across financial, health, and relationship dimensions.",
        icon: Target,
        status: "not_started" as ModuleStatus,
        duration: "25 mins",
        href: "/workbook/goals",
    },
    {
        id: "work-values",
        title: "Work Values",
        description: "Identify and prioritize what matters most in your career.",
        icon: Scale,
        status: "not_started" as ModuleStatus,
        duration: "20 mins",
        href: "/workbook/values",
    },
    {
        id: "knowledge-passion",
        title: "Knowledge-Passion Matrix",
        description: "Strategic plot of your skills and passions to identify growth areas.",
        icon: Compass,
        status: "locked" as ModuleStatus,
        duration: "25 mins",
        href: "/workbook/matrix",
    },
    {
        id: "career-fit",
        title: "Career Fit Analysis",
        description: "Quantitatively assess alignment with your current role.",
        icon: Calculator,
        status: "locked" as ModuleStatus,
        duration: "15 mins",
        href: "/workbook/fit-analysis",
    },
    {
        id: "session-notes",
        title: "Session Notes",
        description: "Track your mentoring sessions and action items.",
        icon: FileText,
        status: "locked" as ModuleStatus,
        duration: "Ongoing",
        href: "/workbook/notes",
    },
]

export default function WorkbookPage() {
    return (
        <div className="container-uplift space-y-8">
            <div>
                <h1 className="heading-pagetitle text-charcoal-900">Mid-Career Workbook</h1>
                <p className="body-large text-charcoal-600 mt-2 max-w-3xl">
                    Your digital companion for the Destination Mastery™ program. Complete these modules to gain deep insights and build your future roadmap.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <WorkbookModuleCard
                        key={module.id}
                        {...module}
                    />
                ))}
            </div>
        </div>
    )
}
