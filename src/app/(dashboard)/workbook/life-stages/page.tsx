"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import { Separator } from "@/components/ui/separator"

type LifeStageId = "dependent" | "childhood" | "school" | "higher_ed" | "exploration" | "establishment" | "mid_career" | "maintenance" | "growth" | "decline"

interface LifeStage {
    id: LifeStageId
    name: string
    ageRange: [number, number]
    happiness: number // 1-5
    roles: string[]
}

const initialStages: LifeStage[] = [
    { id: "dependent", name: "Dependent on Others", ageRange: [0, 5], happiness: 5, roles: ["Child"] },
    { id: "childhood", name: "Childhood", ageRange: [5, 12], happiness: 5, roles: ["Student", "Child"] },
    { id: "school", name: "School", ageRange: [12, 18], happiness: 4, roles: ["Student", "Child"] },
    { id: "higher_ed", name: "Higher Education", ageRange: [18, 22], happiness: 4, roles: ["Student"] },
    { id: "exploration", name: "Exploration", ageRange: [22, 30], happiness: 3, roles: ["Worker", "Partner"] },
    { id: "establishment", name: "Establishment", ageRange: [30, 40], happiness: 3, roles: ["Parent", "Worker"] },
    { id: "mid_career", name: "Mid Career (Current)", ageRange: [40, 50], happiness: 3, roles: ["Parent", "Worker"] },
]

const rolesList = ["Parent", "Homemaker", "Student", "Earning Member", "Child", "Worker", "Citizen", "Partner"]

export default function LifeStagesPage() {
    const [stages, setStages] = useState<LifeStage[]>(initialStages)

    const handleHappinessChange = (id: LifeStageId, newScore: number) => {
        setStages(stages.map(s => s.id === id ? { ...s, happiness: newScore } : s))
    }

    const handleRoleToggle = (id: LifeStageId, role: string) => {
        setStages(stages.map(s => {
            if (s.id !== id) return s
            const newRoles = s.roles.includes(role)
                ? s.roles.filter(r => r !== role)
                : [...s.roles, role]
            return { ...s, roles: newRoles }
        }))
    }

    // Calculate stats
    const totalYears = stages.reduce((acc, s) => acc + (s.ageRange[1] - s.ageRange[0]), 0)
    const totalScore = stages.reduce((acc, s) => acc + ((s.ageRange[1] - s.ageRange[0]) * s.happiness), 0)
    const readinessScore = ((totalScore / totalYears) * 20).toFixed(1) // Normalized to 100

    // Chart data
    const chartData = stages.map(s => ({
        name: s.name,
        happiness: s.happiness,
        age: s.ageRange[1]
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
                    <h1 className="heading-pagetitle text-charcoal-900">Life Stages Timeline</h1>
                    <p className="body-large text-charcoal-600">Module 4 of 9</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="light" className="bg-gradient-to-br from-purple-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-display text-charcoal-800">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                Happiness Trajectory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHappiness" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                                    <YAxis domain={[0, 5]} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="happiness" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHappiness)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card variant="light">
                        <CardHeader>
                            <CardTitle className="text-xl font-display text-charcoal-800">Life Stages Detail</CardTitle>
                            <CardDescription>
                                Rate your happiness (1-5) and select roles played during each stage.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {stages.map((stage) => (
                                <div key={stage.id} className="relative pl-8 border-l-2 border-purple-100 last:border-0 pb-8 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm" />

                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold font-display text-charcoal-800">{stage.name}</h3>
                                                <span className="text-sm text-charcoal-500 font-body">Age: {stage.ageRange[0]} - {stage.ageRange[1]} years</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-purple-50 px-3 py-1.5 rounded-lg">
                                                <span className="text-sm font-medium text-charcoal-700">Happiness: {stage.happiness}/5</span>
                                                <Slider
                                                    value={[stage.happiness]}
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onValueChange={(val) => handleHappinessChange(stage.id, val[0])}
                                                    className="w-24"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold">Roles</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {rolesList.map(role => (
                                                    <div key={role} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`${stage.id}-${role}`}
                                                            checked={stage.roles.includes(role)}
                                                            onCheckedChange={() => handleRoleToggle(stage.id, role)}
                                                        />
                                                        <Label
                                                            htmlFor={`${stage.id}-${role}`}
                                                            className="text-sm font-body text-charcoal-700 font-normal cursor-pointer"
                                                        >
                                                            {role}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Summary */}
                <div className="space-y-6">
                    <Card variant="light" className="sticky top-24 border-gold-200 bg-gold-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-display text-charcoal-800">Life Readiness Score</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-center">
                            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        className="text-gold-200"
                                        strokeWidth="10"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="58"
                                        cx="64"
                                        cy="64"
                                    />
                                    <circle
                                        className="text-gold-500 transition-all duration-1000 ease-out"
                                        strokeWidth="10"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (364 * parseFloat(readinessScore)) / 100}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="58"
                                        cx="64"
                                        cy="64"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold font-display text-charcoal-900">{readinessScore}%</span>
                                    <span className="text-xs text-charcoal-500 uppercase tracking-widest">Score</span>
                                </div>
                            </div>

                            <div className="text-left space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal-600">Total Years Analyzed</span>
                                    <span className="font-semibold">{totalYears}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-charcoal-600">Weighted Score</span>
                                    <span className="font-semibold">{totalScore}</span>
                                </div>
                            </div>

                            <Separator />

                            <Button className="w-full">
                                <Save className="w-4 h-4 mr-2" />
                                Save & Analyze
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
