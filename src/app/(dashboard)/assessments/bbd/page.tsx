"use client"

import { BBDAssessmentWizard } from "@/components/assessments/bbd-assessment-wizard"

export default function BBDAssessmentPage() {
    return (
        <div className="container-uplift font-body py-12">
            <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal-900 tracking-tight">
                    BBD Syndrome Assessment
                </h1>
                <p className="text-xl text-charcoal-600 font-body leading-relaxed max-w-2xl mx-auto">
                    Are you Bored, Burned out, or feeling Declined? Take this diagnostic test to understand your professional state of mind.
                </p>
            </div>

            <BBDAssessmentWizard />
        </div>
    )
}
