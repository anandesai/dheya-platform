"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Goal {
    id: string
    category: "financial" | "duties" | "relationships" | "health"
    title: string
    status: "achieved" | "ongoing" | "not_achieved"
    date?: string
    progress: number
}

const initialGoals: Goal[] = [
    { id: "1", category: "financial", title: "Build retirement corpus of 5Cr", status: "ongoing", progress: 40, date: "2030-12-31" },
    { id: "2", category: "financial", title: "Children's education fund", status: "ongoing", progress: 60, date: "2028-06-01" },
    { id: "3", category: "health", title: "Run a half-marathon", status: "not_achieved", progress: 10 },
    { id: "4", category: "relationships", title: "Monthly family dinners", status: "achieved", progress: 100 },
]

export default function LifeGoalsPage() {
    const [goals] = useState<Goal[]>(initialGoals)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "achieved": return "text-green-600 bg-green-50 border-green-200"
            case "ongoing": return "text-blue-600 bg-blue-50 border-blue-200"
            case "not_achieved": return "text-red-600 bg-red-50 border-red-200"
            default: return "text-gray-600 bg-gray-50"
        }
    }

    const getCategoryTitle = (cat: string) => {
        switch (cat) {
            case "financial": return "Financial Goals"
            case "duties": return "Duties & Responsibilities"
            case "relationships": return "Relationship Goals"
            case "health": return "Health & Wellbeing"
        }
    }

    return (
        <div className="container-uplift space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/workbook">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5 text-charcoal-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="heading-pagetitle text-charcoal-900">Life Goals Tracker</h1>
                        <p className="body-large text-charcoal-600">Module 5 of 9</p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Life Goal</DialogTitle>
                            <DialogDescription>Define a new goal to track your progress.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="financial">Financial</SelectItem>
                                        <SelectItem value="duties">Duties & Responsibilities</SelectItem>
                                        <SelectItem value="relationships">Relationships</SelectItem>
                                        <SelectItem value="health">Health & Wellbeing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="goal">Goal Description</Label>
                                <Input id="goal" placeholder="e.g., Buy a vacation home" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="target">Target Date</Label>
                                <Input id="target" type="date" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Goal</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["financial", "duties", "relationships", "health"] as const).map((category) => (
                    <Card key={category} variant="light" className="h-full">
                        <CardHeader className="pb-3 border-b border-cream-200">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-display text-charcoal-800">
                                    {getCategoryTitle(category)}
                                </CardTitle>
                                <Badge variant="outline" className="bg-white">
                                    {goals.filter(g => g.category === category).length} Goals
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {goals.filter(g => g.category === category).map((goal) => (
                                <div key={goal.id} className="p-3 rounded-lg border border-cream-200 bg-white hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-charcoal-800 text-sm line-clamp-2">{goal.title}</h4>
                                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 ${getStatusColor(goal.status)}`}>
                                            {goal.status === "achieved" ? "Achieved" : goal.status === "ongoing" ? "Ongoing" : "Not Achieved"}
                                        </Badge>
                                    </div>

                                    {goal.status !== "achieved" && (
                                        <div className="space-y-1.5 mt-2">
                                            <div className="flex justify-between text-xs text-charcoal-500">
                                                <span>Progress</span>
                                                <span>{goal.progress}%</span>
                                            </div>
                                            <Progress value={goal.progress} className="h-1.5" />
                                        </div>
                                    )}

                                    {goal.date && (
                                        <div className="flex items-center text-xs text-charcoal-400 mt-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Target: {new Date(goal.date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {goals.filter(g => g.category === category).length === 0 && (
                                <div className="text-center py-8 text-charcoal-400">
                                    <p className="text-sm">No goals added yet.</p>
                                    <Button variant="link" className="text-purple-600 btn-link">Add Goal</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
