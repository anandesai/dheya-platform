"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, AlertCircle } from "lucide-react"

// Questions from the brief
const SECTIONS = [
    {
        id: "workplace_engagement",
        title: "Workplace Engagement",
        questions: [
            { id: 1, text: "Do you find yourself weary of dealing with new employees coming and going constantly?" },
            { id: 2, text: "Do you feel that you have little in common with colleagues who are of different ages and backgrounds?" },
            { id: 3, text: "Do you find yourself watching the clock when you're at work?" },
            { id: 4, text: "Has your work stopped feeling like fun at least some of the time?" },
            { id: 5, text: "Do you feel that you are dragging yourself to the workplace?" },
        ]
    },
    {
        id: "job_security",
        title: "Job Security & Future",
        questions: [
            { id: 6, text: "Have you recently been forcefully exited?" },
            { id: 7, text: "Do you ever feel convinced that you were or going to be exited because you're older?" },
            { id: 8, text: "Do you feel you no longer fit in with your current leadership?" },
            { id: 9, text: "Do you believe that you'll never find another job if you lose this one?" },
            { id: 10, text: "Does retirement seem like your only option?" },
        ]
    },
    {
        id: "behavioral",
        title: "Behavioral Changes",
        questions: [
            { id: 11, text: "Does retirement seem like your only option, or do you feel you are no longer valued by your company?" }, // Note: Corrected ID mapping from brief
            { id: 12, text: "Has your demeanor at work changed negatively in recent years?" },
            { id: 13, text: "Do you find yourself snapping at people frequently or displaying impatience?" },
            { id: 14, text: "Are you tired and lethargic in the middle of the day for no good reason?" },
            { id: 15, text: "Do you resist changes in processes and policies?" },
        ]
    },
    {
        id: "self_esteem",
        title: "Self-Esteem & Adaptability",
        questions: [
            { id: 16, text: "Is your professional self-esteem lower than it has been in the past?" },
            { id: 17, text: "Do you believe that other, younger people are superseding you or soon will?" },
            { id: 18, text: "Are you reluctant to consider any career paths besides your current one?" },
            { id: 19, text: "Are you intimidated by new technology or resist new systems?" },
            { id: 20, text: "Has the increased stress in your job made you cynical and pessimistic?" },
        ]
    },
    {
        id: "attitude",
        title: "Attitude & Initiative",
        questions: [
            { id: 21, text: "Do you frequently talk about the 'good old days'?" },
            { id: 22, text: "Do you complain that your organization's leadership no longer cares about their people?" },
            { id: 23, text: "Are you unwilling or unable to do anything to shake yourself out of your work routine?" },
            { id: 24, text: "Do you feel content to just go through the motions in order to collect your salary?" },
            { id: 25, text: "Do you avoid stretch assignments or any type of work challenges?" },
        ]
    }
]

export function BBDAssessmentWizard() {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, boolean>>({})
    const [isCompleted, setIsCompleted] = useState(false)

    const currentSection = SECTIONS[currentSectionIndex]
    const allQuestions = SECTIONS.flatMap(s => s.questions)
    const totalQuestions = allQuestions.length
    const answeredCount = Object.keys(answers).length
    const progress = (answeredCount / totalQuestions) * 100

    const handleAnswer = (questionId: number, value: boolean) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const saveResults = async () => {
        try {
            const score = calculateScore()
            const response = await fetch("/api/assessments/bbd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, score }),
            })

            if (!response.ok) throw new Error("Failed to save results")

            // console.log("Results saved successfully") 
        } catch (error) {
            console.error("Error saving results:", error)
            // toast.error("Failed to save your progress. Please try again.") // Ideally add toast here
        }
    }

    const handleNext = async () => {
        if (currentSectionIndex < SECTIONS.length - 1) {
            setCurrentSectionIndex(prev => prev + 1)
        } else {
            await saveResults()
            setIsCompleted(true)
        }
    }

    const calculateScore = () => {
        return Object.values(answers).filter(Boolean).length
    }

    const getResultLevel = (score: number) => {
        if (score <= 5) return { level: "Low", color: "text-green-600", desc: "Monitor but stable. You are managing well." }
        if (score <= 10) return { level: "Moderate", color: "text-yellow-600", desc: "Career fitness check recommended. Some signs of burnout." }
        if (score <= 15) return { level: "High", color: "text-orange-600", desc: "Career guidance session needed. BBD Syndrome is affecting you." }
        return { level: "Critical", color: "text-red-600", desc: "Comprehensive mentoring program advised. Immediate action required." }
    }

    if (isCompleted) {
        const score = calculateScore()
        const result = getResultLevel(score)

        return (
            <Card variant="light" className="max-w-2xl mx-auto p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-cream-200 mx-auto flex items-center justify-center mb-6">
                    <AlertCircle className={`w-10 h-10 ${result.color}`} />
                </div>
                <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-2">Assessment Complete</h2>
                <p className="text-charcoal-600 font-body mb-8">Here is your BBD Syndrome analysis</p>

                <div className="bg-cream-50 rounded-xl p-8 mb-8 border border-cream-200">
                    <p className="text-sm font-display uppercase tracking-widest text-charcoal-500 mb-2">BBD Score</p>
                    <div className="text-6xl font-display font-bold text-charcoal-900 mb-2">{score}<span className="text-2xl text-charcoal-400">/25</span></div>
                    <div className={`text-xl font-bold ${result.color} mb-2`}>{result.level} Impact</div>
                    <p className="text-charcoal-600 font-body">{result.desc}</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button variant="uplift" size="lg" onClick={() => window.location.href = '/dashboard'}>
                        Go to Dashboard
                    </Button>
                    <Button variant="upliftOutline" size="lg" onClick={() => window.location.href = '/mentors'}>
                        Speak to a Mentor
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-charcoal-900">{currentSection.title}</h2>
                        <p className="text-charcoal-500 font-body text-sm">Section {currentSectionIndex + 1} of {SECTIONS.length}</p>
                    </div>
                    <span className="font-display font-bold text-purple-600">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-cream-200" indicatorClassName="bg-purple-500" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSectionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {currentSection.questions.map((q) => (
                        <Card key={q.id} variant="light" className={`transition-all duration-200 ${answers[q.id] !== undefined ? 'border-purple-200 bg-purple-50/10' : ''}`}>
                            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="font-body text-lg text-charcoal-800 flex-1">{q.text}</p>
                                <div className="flex gap-3 flex-shrink-0">
                                    <Button
                                        variant={answers[q.id] === true ? "uplift" : "outline"}
                                        size="sm"
                                        onClick={() => handleAnswer(q.id, true)}
                                        className={answers[q.id] === true ? "bg-red-500 hover:bg-red-600 border-red-500 text-white" : "hover:text-red-600 hover:border-red-200"}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        variant={answers[q.id] === false ? "uplift" : "outline"}
                                        size="sm"
                                        onClick={() => handleAnswer(q.id, false)}
                                        className={answers[q.id] === false ? "bg-green-600 hover:bg-green-700 border-green-600 text-white" : "hover:text-green-600 hover:border-green-200"}
                                    >
                                        No
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
                <Button
                    variant="uplift"
                    size="lg"
                    onClick={handleNext}
                    disabled={currentSection.questions.some(q => answers[q.id] === undefined)}
                >
                    {currentSectionIndex === SECTIONS.length - 1 ? 'Finish Assessment' : 'Next Section'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
