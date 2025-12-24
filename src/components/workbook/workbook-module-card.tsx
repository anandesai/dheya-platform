"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export type ModuleStatus = "locked" | "not_started" | "in_progress" | "completed"

interface WorkbookModuleCardProps {
    title: string
    description: string
    icon: React.ElementType
    status: ModuleStatus
    href: string
    duration?: string
}

export function WorkbookModuleCard({
    title,
    description,
    icon: Icon,
    status,
    href,
    duration,
}: WorkbookModuleCardProps) {
    const isLocked = status === "locked"
    const isCompleted = status === "completed"

    return (
        <Card
            variant="light"
            hover={!isLocked ? "glow" : undefined}
            className={`h-full flex flex-col transition-all duration-300 ${isLocked ? "bg-cream-50 opacity-80" : "bg-white border-cream-200"
                }`}
        >
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isCompleted
                        ? "bg-forest-100 text-forest-600"
                        : isLocked
                            ? "bg-charcoal-50 text-charcoal-400"
                            : "bg-purple-100 text-purple-600"
                        }`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <StatusBadge status={status} />
                </div>

                <h3 className={`text-lg font-display font-bold mb-2 ${isLocked ? "text-charcoal-500" : "text-charcoal-800"
                    }`}>
                    {title}
                </h3>

                <p className="text-sm text-charcoal-600 font-body mb-6 flex-grow">
                    {description}
                </p>

                <div className="mt-auto space-y-4">
                    {duration && (
                        <div className="flex items-center text-xs text-charcoal-500 font-body">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            <span>{duration}</span>
                        </div>
                    )}

                    {isLocked ? (
                        <Button variant="outline" className="w-full justify-between" disabled>
                            <span>Locked</span>
                            <Lock className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Link href={href} className="block">
                            <Button
                                variant={isCompleted ? "outline" : "default"}
                                className="w-full justify-between group"
                            >
                                <span>{isCompleted ? "Review" : "Start Module"}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function StatusBadge({ status }: { status: ModuleStatus }) {
    switch (status) {
        case "completed":
            return (
                <Badge variant="secondary" className="bg-forest-50 text-forest-700 border-forest-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </Badge>
            )
        case "in_progress":
            return (
                <Badge variant="secondary" className="bg-gold-50 text-gold-700 border-gold-200">
                    In Progress
                </Badge>
            )
        case "locked":
            return (
                <Badge variant="outline" className="text-charcoal-400 border-charcoal-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                </Badge>
            )
        default:
            return (
                <Badge variant="outline" className="text-charcoal-500 border-charcoal-200">
                    Not Started
                </Badge>
            )
    }
}
