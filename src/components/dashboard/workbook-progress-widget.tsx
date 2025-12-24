"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WorkbookProgressWidget() {
    // This would eventually be calculated from real data
    const totalModules = 9
    const completedModules = 1
    const progress = (completedModules / totalModules) * 100

    return (
        <Card variant="light" className="border-purple-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2 text-charcoal-800">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Workbook Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-2xl font-bold font-display text-charcoal-900">
                                {completedModules}/{totalModules}
                            </span>
                            <p className="text-xs text-charcoal-600 font-body">Modules Completed</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-purple-600 font-display">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <div className="pt-2">
                        <Link href="/workbook">
                            <Button variant="outline" size="sm" className="w-full text-charcoal-600 border-charcoal-200 hover:text-purple-600 hover:border-purple-200">
                                Continue Workbook
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
