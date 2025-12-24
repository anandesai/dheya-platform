"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts"

interface Trait {
    id: string
    name: string
    score: number
}

const initialTraits: Trait[] = [
    { id: "1", name: "Openness", score: 75 },
    { id: "2", name: "Conscientiousness", score: 85 },
    { id: "3", name: "Extraversion", score: 60 },
    { id: "4", name: "Agreeableness", score: 90 },
    { id: "5", name: "Neuroticism", score: 40 },
]

export default function PersonalityTraitsPage() {
    const [traits, setTraits] = useState<Trait[]>(initialTraits)

    const handleScoreChange = (id: string, newScore: number) => {
        setTraits(traits.map(t => t.id === id ? { ...t, score: newScore } : t))
    }

    // Transform data for chart
    const chartData = traits.map(t => ({
        subject: t.name,
        A: t.score,
        fullMark: 100,
    }))

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
                    <h1 className="heading-pagetitle text-charcoal-900">Personality Traits</h1>
                    <p className="body-large text-charcoal-600">Module 3 of 9</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualization */}
                <Card variant="light" className="flex flex-col justify-center items-center p-6 bg-white min-h-[400px]">
                    <CardHeader className="w-full">
                        <CardTitle className="text-xl font-display text-charcoal-800 text-center">Trait Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#e5e5e5" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontFamily: 'var(--font-display)' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="My Traits"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Input Form */}
                <Card variant="light">
                    <CardHeader>
                        <CardTitle className="text-xl font-display text-charcoal-800">Assessment Scores</CardTitle>
                        <CardDescription>
                            Adjust sliders to match your assessment results (0-100%).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {traits.map((trait) => (
                            <div key={trait.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-medium text-charcoal-800">{trait.name}</Label>
                                    <span className="text-sm font-bold text-purple-600">{trait.score}%</span>
                                </div>
                                <Slider
                                    value={[trait.score]}
                                    max={100}
                                    step={1}
                                    onValueChange={(val) => handleScoreChange(trait.id, val[0])}
                                    className="py-2"
                                />
                            </div>
                        ))}

                        <div className="pt-6 flex justify-end">
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                Save Traits
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
