"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Calculator } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"

interface ValueFit {
    id: string
    name: string
    weight: number // 0-100, must sum to 100
    currentScore: number // 0-100
}

const initialValues: ValueFit[] = [
    { id: "1", name: "Financial Freedom", weight: 30, currentScore: 60 },
    { id: "2", name: "Work-Life Balance", weight: 25, currentScore: 40 },
    { id: "3", name: "Creativity", weight: 20, currentScore: 80 },
    { id: "4", name: "Leadership", weight: 15, currentScore: 50 },
    { id: "5", name: "Social Impact", weight: 10, currentScore: 30 },
]

export default function CareerFitAnalysisPage() {
    const [values, setValues] = useState<ValueFit[]>(initialValues)

    const handleWeightChange = (id: string, weight: number) => {
        // In a real app, we'd need logic to balance other weights or warn user
        setValues(values.map(v => v.id === id ? { ...v, weight } : v))
    }

    const handleScoreChange = (id: string, score: number) => {
        setValues(values.map(v => v.id === id ? { ...v, currentScore: score } : v))
    }

    const totalWeight = values.reduce((acc, v) => acc + v.weight, 0)

    // Calculate weighted fit score
    // Formula: Sum(Weight * Score) / 100
    const weightedScore = values.reduce((acc, v) => acc + (v.weight * v.currentScore), 0) / 100

    return (
        <div className="container-uplift space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/workbook">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5 text-charcoal-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="heading-pagetitle text-charcoal-900">Career Fit Analysis</h1>
                    <p className="body-large text-charcoal-600">Module 8 of 9</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="light">
                        <CardHeader>
                            <CardTitle className="text-xl font-display text-charcoal-800">Values & Alignment</CardTitle>
                            <CardDescription>
                                Adjust weights to reflect importance (must sum to 100). Rate how well your current role meets each value.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center bg-cream-50 p-4 rounded-lg">
                                <span className="font-semibold text-charcoal-700">Total Weight Distribution</span>
                                <span className={`font-bold ${totalWeight === 100 ? "text-green-600" : "text-amber-600"}`}>
                                    {totalWeight}%
                                </span>
                            </div>

                            {values.map((value) => (
                                <div key={value.id} className="p-4 border border-cream-200 rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-bold text-charcoal-800">{value.name}</Label>
                                        <div className="text-right">
                                            <span className="text-xs text-charcoal-500 block">Contribution</span>
                                            <span className="font-mono font-medium text-purple-600">
                                                {((value.weight * value.currentScore) / 100).toFixed(1)} pts
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-charcoal-600">Importance Weight</span>
                                                <span className="font-semibold">{value.weight}%</span>
                                            </div>
                                            <Slider
                                                value={[value.weight]}
                                                max={100}
                                                step={5}
                                                onValueChange={(val) => handleWeightChange(value.id, val[0])}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-charcoal-600">Current Fulfillment</span>
                                                <span className={`font-semibold ${value.currentScore > 70 ? "text-green-600" : value.currentScore < 40 ? "text-red-600" : "text-amber-600"}`}>
                                                    {value.currentScore}%
                                                </span>
                                            </div>
                                            <Slider
                                                value={[value.currentScore]}
                                                max={100}
                                                step={5}
                                                onValueChange={(val) => handleScoreChange(value.id, val[0])}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card variant="light" className="sticky top-24 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Calculator className="w-5 h-5" />
                                Fit Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-6">
                            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-8 border-white/20"></div>
                                <div className="text-5xl font-bold font-display">{weightedScore.toFixed(0)}</div>
                                <div className="absolute bottom-8 text-xs uppercase tracking-widest opacity-80">Index</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm opacity-90">
                                    <span>Alignment Status</span>
                                    <span className="font-semibold">
                                        {weightedScore > 70 ? "Strong Fit" : weightedScore > 40 ? "Moderate" : "Misaligned"}
                                    </span>
                                </div>
                                <Progress value={weightedScore} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                            </div>

                            <div className="bg-white/10 p-4 rounded-lg text-left text-sm backdrop-blur-sm">
                                <p>
                                    {weightedScore > 70
                                        ? "Your current role aligns well with your core values. Focus on growth and mastery."
                                        : "There are significant gaps between your values and current reality. Consider strategic pivots."}
                                </p>
                            </div>

                            <Button variant="secondary" className="w-full bg-white text-purple-700 hover:bg-cream-50">
                                <Save className="w-4 h-4 mr-2" />
                                Save Analysis
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
