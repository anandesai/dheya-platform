"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"

// Types
type QuestionType =
  | "likert"
  | "multi-select"
  | "single-select"
  | "open-text"
  | "rating-scale"
  | "ranking"
  | "matrix"

interface QuestionOption {
  id: string
  label: string
  value: string | number
  description?: string
}

interface Question {
  id: string
  type: QuestionType
  text: string
  helpText?: string
  required: boolean
  options?: QuestionOption[]
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  scoringDimension?: string
  scoringWeight?: number
}

interface Section {
  id: string
  title: string
  description?: string
  questions: Question[]
  isExpanded: boolean
}

interface ScoringDimension {
  key: string
  name: string
  description: string
  weight: number
}

interface ScoringThreshold {
  level: string
  min: number
  max: number
  description: string
  recommendation: string
}

// Mock initial data for editing
const mockToolData = {
  id: "1",
  code: "BBD-001",
  name: "BBD Syndrome Assessment",
  description:
    "Assess the presence and severity of Boredom, Burnout, and Dissatisfaction in your career.",
  category: "assessment",
  segments: ["mid_career"],
  phase: 1,
  estimatedTime: 15,
  status: "active",
  sections: [
    {
      id: "section-1",
      title: "Boredom Indicators",
      description: "Questions about engagement and stimulation at work",
      isExpanded: true,
      questions: [
        {
          id: "bored-1",
          type: "likert" as QuestionType,
          text: "I feel challenged by my daily work tasks",
          helpText: "Consider how often you feel mentally stimulated",
          required: true,
          scoringDimension: "bored",
          scoringWeight: 1,
        },
        {
          id: "bored-2",
          type: "likert" as QuestionType,
          text: "I learn something new at work regularly",
          required: true,
          scoringDimension: "bored",
          scoringWeight: 1,
        },
      ],
    },
  ],
  scoringConfig: {
    dimensions: [
      {
        key: "bored",
        name: "Boredom",
        description: "Measures lack of engagement and stimulation",
        weight: 0.33,
      },
      {
        key: "burnout",
        name: "Burnout",
        description: "Measures exhaustion and emotional depletion",
        weight: 0.33,
      },
      {
        key: "dissatisfied",
        name: "Dissatisfaction",
        description: "Measures misalignment with values and expectations",
        weight: 0.34,
      },
    ],
    thresholds: [
      {
        level: "Low",
        min: 0,
        max: 25,
        description: "Minimal BBD symptoms",
        recommendation: "Continue monitoring your career health",
      },
      {
        level: "Moderate",
        min: 26,
        max: 45,
        description: "Some BBD symptoms present",
        recommendation: "Consider proactive career interventions",
      },
      {
        level: "High",
        min: 46,
        max: 60,
        description: "Significant BBD symptoms",
        recommendation: "Structured mentorship recommended",
      },
      {
        level: "Critical",
        min: 61,
        max: 75,
        description: "Severe BBD symptoms",
        recommendation: "Immediate intervention required",
      },
    ],
  },
}

const questionTypes: { value: QuestionType; label: string; description: string }[] = [
  { value: "likert", label: "Likert Scale", description: "1-5 agreement scale" },
  { value: "multi-select", label: "Multi-Select", description: "Multiple choice" },
  { value: "single-select", label: "Single Select", description: "One option only" },
  { value: "open-text", label: "Open Text", description: "Free text input" },
  { value: "rating-scale", label: "Rating Scale", description: "0-100 slider" },
  { value: "ranking", label: "Ranking", description: "Drag to order" },
]

const segmentOptions = [
  { id: "early_career", label: "Early Career (22-30)" },
  { id: "mid_career", label: "Mid-Career (30-45)" },
  { id: "senior", label: "Senior (45+)" },
  { id: "returning_women", label: "Returning Women" },
]

export default function ToolEditorPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.toolId === "new"

  // Form state
  const [formData, setFormData] = useState({
    code: isNew ? "" : mockToolData.code,
    name: isNew ? "" : mockToolData.name,
    description: isNew ? "" : mockToolData.description,
    category: isNew ? "assessment" : mockToolData.category,
    segments: isNew ? [] : mockToolData.segments,
    phase: isNew ? 1 : mockToolData.phase,
    estimatedTime: isNew ? 15 : mockToolData.estimatedTime,
    status: isNew ? "draft" : mockToolData.status,
  })

  const [sections, setSections] = useState<Section[]>(
    isNew ? [] : mockToolData.sections
  )

  const [scoringDimensions, setScoringDimensions] = useState<ScoringDimension[]>(
    isNew ? [] : mockToolData.scoringConfig.dimensions
  )

  const [scoringThresholds, setScoringThresholds] = useState<ScoringThreshold[]>(
    isNew ? [] : mockToolData.scoringConfig.thresholds
  )

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)

  // Handlers
  const handleSegmentToggle = (segmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      segments: prev.segments.includes(segmentId)
        ? prev.segments.filter((s) => s !== segmentId)
        : [...prev.segments, segmentId],
    }))
  }

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: "",
      questions: [],
      isExpanded: true,
    }
    setSections([...sections, newSection])
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    )
  }

  const deleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
  }

  const toggleSectionExpand = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
      )
    )
  }

  const addQuestion = (sectionId: string, type: QuestionType) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      text: "",
      required: true,
      options:
        type === "multi-select" || type === "single-select"
          ? [
              { id: "opt-1", label: "Option 1", value: 1 },
              { id: "opt-2", label: "Option 2", value: 2 },
            ]
          : undefined,
    }

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s
      )
    )
    setIsAddQuestionOpen(false)
  }

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      )
    )
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      )
    )
  }

  const addDimension = () => {
    const newDimension: ScoringDimension = {
      key: `dim-${Date.now()}`,
      name: "",
      description: "",
      weight: 0,
    }
    setScoringDimensions([...scoringDimensions, newDimension])
  }

  const updateDimension = (key: string, updates: Partial<ScoringDimension>) => {
    setScoringDimensions((prev) =>
      prev.map((d) => (d.key === key ? { ...d, ...updates } : d))
    )
  }

  const deleteDimension = (key: string) => {
    setScoringDimensions((prev) => prev.filter((d) => d.key !== key))
  }

  const addThreshold = () => {
    const newThreshold: ScoringThreshold = {
      level: "",
      min: 0,
      max: 100,
      description: "",
      recommendation: "",
    }
    setScoringThresholds([...scoringThresholds, newThreshold])
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push("/admin/tools")
  }

  const totalQuestions = sections.reduce(
    (acc, s) => acc + s.questions.length,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? "Create New Tool" : `Edit: ${formData.name}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Create a new assessment or tool"
                : `Code: ${formData.code}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={
              formData.status === "active"
                ? "bg-green-100 text-green-700"
                : formData.status === "draft"
                ? "bg-gray-100 text-gray-700"
                : "bg-red-100 text-red-700"
            }
          >
            {formData.status}
          </Badge>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Tool"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">
            Content ({totalQuestions} questions)
          </TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
              <CardDescription>
                Basic details about this assessment or tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Tool Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., BBD-001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for this tool
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="workbook">Workbook</SelectItem>
                      <SelectItem value="framework">Framework</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tool Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., BBD Syndrome Assessment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this tool measures and how it helps users..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase</Label>
                  <Select
                    value={formData.phase.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, phase: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((phase) => (
                        <SelectItem key={phase} value={phase.toString()}>
                          Phase {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Estimated Time (minutes)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedTime: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Segments</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {segmentOptions.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={segment.id}
                        checked={formData.segments.includes(segment.id)}
                        onCheckedChange={() => handleSegmentToggle(segment.id)}
                      />
                      <label
                        htmlFor={segment.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {segment.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sections & Questions</h3>
            <Button onClick={addSection}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding a section to organize your questions
                </p>
                <Button onClick={addSection}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-grab"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <Input
                            value={section.title}
                            onChange={(e) =>
                              updateSection(section.id, {
                                title: e.target.value,
                              })
                            }
                            className="font-medium text-lg border-0 p-0 h-auto focus-visible:ring-0"
                            placeholder="Section Title"
                          />
                        </div>
                        <Badge variant="secondary">
                          {section.questions.length} questions
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSectionExpand(section.id)}
                        >
                          {section.isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    {section.isExpanded && (
                      <Textarea
                        value={section.description || ""}
                        onChange={(e) =>
                          updateSection(section.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Section description (optional)"
                        className="mt-2"
                        rows={2}
                      />
                    )}
                  </CardHeader>

                  {section.isExpanded && (
                    <CardContent className="space-y-4">
                      {section.questions.map((question) => (
                        <div
                          key={question.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-grab flex-shrink-0 mt-1"
                            >
                              <GripVertical className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {question.type}
                                </Badge>
                                <Badge
                                  variant={
                                    question.required ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {question.required
                                    ? "Required"
                                    : "Optional"}
                                </Badge>
                              </div>
                              <Input
                                value={question.text}
                                onChange={(e) =>
                                  updateQuestion(section.id, question.id, {
                                    text: e.target.value,
                                  })
                                }
                                placeholder="Question text..."
                                className="font-medium"
                              />
                              <Input
                                value={question.helpText || ""}
                                onChange={(e) =>
                                  updateQuestion(section.id, question.id, {
                                    helpText: e.target.value,
                                  })
                                }
                                placeholder="Help text (optional)"
                                className="text-sm"
                              />

                              {/* Options for select questions */}
                              {(question.type === "multi-select" ||
                                question.type === "single-select") &&
                                question.options && (
                                  <div className="space-y-2 mt-2">
                                    <Label className="text-xs">Options</Label>
                                    {question.options.map((opt, optIndex) => (
                                      <div
                                        key={opt.id}
                                        className="flex items-center gap-2"
                                      >
                                        <Input
                                          value={opt.label}
                                          onChange={(e) => {
                                            const newOptions = [
                                              ...question.options!,
                                            ]
                                            newOptions[optIndex] = {
                                              ...opt,
                                              label: e.target.value,
                                            }
                                            updateQuestion(
                                              section.id,
                                              question.id,
                                              { options: newOptions }
                                            )
                                          }}
                                          className="flex-1"
                                          placeholder={`Option ${
                                            optIndex + 1
                                          }`}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            const newOptions =
                                              question.options!.filter(
                                                (_, i) => i !== optIndex
                                              )
                                            updateQuestion(
                                              section.id,
                                              question.id,
                                              { options: newOptions }
                                            )
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = [
                                          ...question.options!,
                                          {
                                            id: `opt-${Date.now()}`,
                                            label: "",
                                            value: question.options!.length + 1,
                                          },
                                        ]
                                        updateQuestion(
                                          section.id,
                                          question.id,
                                          { options: newOptions }
                                        )
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                )}

                              {/* Scoring */}
                              {scoringDimensions.length > 0 && (
                                <div className="flex items-center gap-4 mt-2 pt-2 border-t">
                                  <div className="flex-1">
                                    <Label className="text-xs">
                                      Scoring Dimension
                                    </Label>
                                    <Select
                                      value={question.scoringDimension || ""}
                                      onValueChange={(value) =>
                                        updateQuestion(
                                          section.id,
                                          question.id,
                                          { scoringDimension: value }
                                        )
                                      }
                                    >
                                      <SelectTrigger className="h-8 mt-1">
                                        <SelectValue placeholder="Select..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {scoringDimensions.map((dim) => (
                                          <SelectItem
                                            key={dim.key}
                                            value={dim.key}
                                          >
                                            {dim.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="w-24">
                                    <Label className="text-xs">Weight</Label>
                                    <Input
                                      type="number"
                                      value={question.scoringWeight || 1}
                                      onChange={(e) =>
                                        updateQuestion(
                                          section.id,
                                          question.id,
                                          {
                                            scoringWeight:
                                              parseFloat(e.target.value) || 1,
                                          }
                                        )
                                      }
                                      className="h-8 mt-1"
                                      step={0.1}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteQuestion(section.id, question.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Add Question Button */}
                      <Dialog
                        open={isAddQuestionOpen && currentSectionId === section.id}
                        onOpenChange={(open) => {
                          setIsAddQuestionOpen(open)
                          if (open) setCurrentSectionId(section.id)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setCurrentSectionId(section.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Question</DialogTitle>
                            <DialogDescription>
                              Choose a question type to add
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-3 py-4">
                            {questionTypes.map((type) => (
                              <Button
                                key={type.value}
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-start"
                                onClick={() =>
                                  addQuestion(section.id, type.value)
                                }
                              >
                                <span className="font-medium">
                                  {type.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {type.description}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scoring Tab */}
        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scoring Dimensions</CardTitle>
                  <CardDescription>
                    Define what aspects this tool measures
                  </CardDescription>
                </div>
                <Button onClick={addDimension}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dimension
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {scoringDimensions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No scoring dimensions defined yet
                </div>
              ) : (
                <div className="space-y-4">
                  {scoringDimensions.map((dim) => (
                    <div
                      key={dim.key}
                      className="border rounded-lg p-4 grid grid-cols-4 gap-4"
                    >
                      <div>
                        <Label className="text-xs">Key</Label>
                        <Input
                          value={dim.key}
                          onChange={(e) =>
                            updateDimension(dim.key, { key: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={dim.name}
                          onChange={(e) =>
                            updateDimension(dim.key, { name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Weight</Label>
                        <Input
                          type="number"
                          value={dim.weight}
                          onChange={(e) =>
                            updateDimension(dim.key, {
                              weight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="mt-1"
                          step={0.01}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDimension(dim.key)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Score Thresholds</CardTitle>
                  <CardDescription>
                    Define interpretation levels for scores
                  </CardDescription>
                </div>
                <Button onClick={addThreshold}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Threshold
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {scoringThresholds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No thresholds defined yet
                </div>
              ) : (
                <div className="space-y-4">
                  {scoringThresholds.map((threshold, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs">Level</Label>
                          <Input
                            value={threshold.level}
                            onChange={(e) => {
                              const newThresholds = [...scoringThresholds]
                              newThresholds[index] = {
                                ...threshold,
                                level: e.target.value,
                              }
                              setScoringThresholds(newThresholds)
                            }}
                            className="mt-1"
                            placeholder="e.g., Low"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Min Score</Label>
                          <Input
                            type="number"
                            value={threshold.min}
                            onChange={(e) => {
                              const newThresholds = [...scoringThresholds]
                              newThresholds[index] = {
                                ...threshold,
                                min: parseInt(e.target.value) || 0,
                              }
                              setScoringThresholds(newThresholds)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max Score</Label>
                          <Input
                            type="number"
                            value={threshold.max}
                            onChange={(e) => {
                              const newThresholds = [...scoringThresholds]
                              newThresholds[index] = {
                                ...threshold,
                                max: parseInt(e.target.value) || 0,
                              }
                              setScoringThresholds(newThresholds)
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setScoringThresholds((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={threshold.description}
                          onChange={(e) => {
                            const newThresholds = [...scoringThresholds]
                            newThresholds[index] = {
                              ...threshold,
                              description: e.target.value,
                            }
                            setScoringThresholds(newThresholds)
                          }}
                          className="mt-1"
                          placeholder="What does this level indicate?"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Recommendation</Label>
                        <Textarea
                          value={threshold.recommendation}
                          onChange={(e) => {
                            const newThresholds = [...scoringThresholds]
                            newThresholds[index] = {
                              ...threshold,
                              recommendation: e.target.value,
                            }
                            setScoringThresholds(newThresholds)
                          }}
                          className="mt-1"
                          placeholder="What actions should the user take?"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Status</CardTitle>
              <CardDescription>
                Control visibility and availability of this tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Draft tools are not visible to users
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Define which packages can access this tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Package Access Levels</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {["Guidance", "Planning", "Mentorship"].map((pkg) => (
                    <div
                      key={pkg}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{pkg}</span>
                      <Select defaultValue="full">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Access</SelectItem>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="teaser">Teaser</SelectItem>
                          <SelectItem value="locked">Locked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium">Delete Tool</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this tool and all its data
                  </p>
                </div>
                <Button variant="destructive">Delete Tool</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
