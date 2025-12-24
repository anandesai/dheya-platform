"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Info } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PersonalStylePage() {
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
                    <h1 className="heading-pagetitle text-charcoal-900">Personal Style</h1>
                    <p className="body-large text-charcoal-600">Module 2 of 9</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card variant="light" className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-display text-charcoal-800">Style Assessment</CardTitle>
                        <CardDescription>
                            Based on your RAPD™ assessment, enter your dominant style and description.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert className="bg-blue-50 border-blue-200">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800 font-display">Auto-fill Available</AlertTitle>
                            <AlertDescription className="text-blue-700 font-body">
                                If you have completed the RAPD™ assessment online, your results can be auto-populated.
                                <Button variant="link" className="px-0 ml-2 h-auto text-blue-800 underline">Sync Results</Button>
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="styleType">Dominant Style</Label>
                                <Select>
                                    <SelectTrigger id="styleType" className="w-full md:w-1/2">
                                        <SelectValue placeholder="Select your style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="executor">Executor (D)</SelectItem>
                                        <SelectItem value="influencer">Influencer (I)</SelectItem>
                                        <SelectItem value="relator">Relator (S)</SelectItem>
                                        <SelectItem value="analyst">Analyst (C)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="styleDescription">Style Description</Label>
                                <textarea
                                    id="styleDescription"
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe your personal style, strengths, and communication preferences..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Reflect on how your style impacts your work environment and relationships.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                Save Assessment
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card variant="light" className="bg-cream-50">
                        <CardHeader>
                            <CardTitle className="text-lg font-display text-charcoal-800">Understanding Styles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 font-body text-sm text-charcoal-600">
                            <p>
                                <strong>Executor:</strong> Direct, firm, strong-willed, and results-oriented. Likes challenges and immediate action.
                            </p>
                            <p>
                                <strong>Influencer:</strong> Outgoing, enthusiastic, optimistic, and high-spirited. Likes collaboration and expressing ideas.
                            </p>
                            <p>
                                <strong>Relator:</strong> Even-tempered, accommodating, patient, and humble. Likes stability and helping others.
                            </p>
                            <p>
                                <strong>Analyst:</strong> Analytical, reserved, precise, and private. Likes accuracy and high standards.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
