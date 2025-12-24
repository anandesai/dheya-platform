"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import WorkValuesAssessmentPage from "@/app/(dashboard)/assessments/work-values/page"

export default function WorkValuesPage() {
    return (
        <div className="container-uplift space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/workbook">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5 text-charcoal-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="heading-pagetitle text-charcoal-900">Work Values Assessment</h1>
                    <p className="body-large text-charcoal-600">Module 6 of 9</p>
                </div>
            </div>

            <div className="mt-6">
                <WorkValuesAssessmentPage />
            </div>
        </div>
    )
}
