"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, GripVertical } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Skill {
  id: string
  name: string
  knowledge: number // 0-100
  passion: number // 0-100
}

interface KPMatrixProps {
  skills: Skill[]
  onSkillsChange?: (skills: Skill[]) => void
  readonly?: boolean
  title?: string
}

const quadrantInfo = {
  growth: {
    name: "Growth Zone",
    description: "High knowledge & high passion - Your career drivers",
    color: "bg-green-100 border-green-300",
    textColor: "text-green-700",
    recommendation: "Leverage these for career advancement",
  },
  development: {
    name: "Development Zone",
    description: "Low knowledge & high passion - Areas to invest in",
    color: "bg-blue-100 border-blue-300",
    textColor: "text-blue-700",
    recommendation: "Focus learning efforts here",
  },
  survivor: {
    name: "Survivor Zone",
    description: "High knowledge & low passion - Competencies without joy",
    color: "bg-amber-100 border-amber-300",
    textColor: "text-amber-700",
    recommendation: "Delegate or reframe these tasks",
  },
  weedOff: {
    name: "Weed Off Zone",
    description: "Low knowledge & low passion - Energy drains",
    color: "bg-red-100 border-red-300",
    textColor: "text-red-700",
    recommendation: "Minimize or eliminate from role",
  },
}

function getQuadrant(knowledge: number, passion: number) {
  if (knowledge >= 50 && passion >= 50) return "growth"
  if (knowledge < 50 && passion >= 50) return "development"
  if (knowledge >= 50 && passion < 50) return "survivor"
  return "weedOff"
}

export function KPMatrix({
  skills: initialSkills,
  onSkillsChange,
  readonly = false,
  title = "Knowledge-Passion Matrix",
}: KPMatrixProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [newSkillName, setNewSkillName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [draggingSkill, setDraggingSkill] = useState<string | null>(null)

  const updateSkills = useCallback(
    (newSkills: Skill[]) => {
      setSkills(newSkills)
      onSkillsChange?.(newSkills)
    },
    [onSkillsChange]
  )

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      knowledge: 50,
      passion: 50,
    }

    updateSkills([...skills, newSkill])
    setNewSkillName("")
    setIsAddDialogOpen(false)
  }

  const handleRemoveSkill = (id: string) => {
    updateSkills(skills.filter((s) => s.id !== id))
    if (selectedSkill?.id === id) setSelectedSkill(null)
  }

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    skillId: string
  ) => {
    if (readonly) return

    const container = e.currentTarget.closest(".kp-matrix-grid")
    if (!container) return

    const rect = container.getBoundingClientRect()

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100
      const y = ((rect.bottom - moveEvent.clientY) / rect.height) * 100

      const clampedX = Math.max(0, Math.min(100, x))
      const clampedY = Math.max(0, Math.min(100, y))

      updateSkills(
        skills.map((s) =>
          s.id === skillId
            ? { ...s, knowledge: Math.round(clampedX), passion: Math.round(clampedY) }
            : s
        )
      )
    }

    const handleMouseUp = () => {
      setDraggingSkill(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    setDraggingSkill(skillId)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Group skills by quadrant
  const skillsByQuadrant = skills.reduce(
    (acc, skill) => {
      const quadrant = getQuadrant(skill.knowledge, skill.passion)
      acc[quadrant].push(skill)
      return acc
    },
    {
      growth: [] as Skill[],
      development: [] as Skill[],
      survivor: [] as Skill[],
      weedOff: [] as Skill[],
    }
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {!readonly && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name">Skill Name</Label>
                    <Input
                      id="skill-name"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g., Data Analysis, Public Speaking"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSkill()
                      }}
                    />
                  </div>
                  <Button onClick={handleAddSkill} className="w-full">
                    Add Skill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Matrix Grid */}
        <div className="relative">
          {/* Axis Labels */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground whitespace-nowrap">
            Passion →
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-muted-foreground">
            Knowledge →
          </div>

          {/* Grid Container */}
          <div
            className="kp-matrix-grid relative w-full aspect-square border-2 border-gray-200 rounded-lg overflow-hidden ml-4"
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-blue-50 border-r border-b border-gray-200" />
              <div className="bg-green-50 border-b border-gray-200" />
              <div className="bg-red-50 border-r border-gray-200" />
              <div className="bg-amber-50" />
            </div>

            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-xs font-medium text-blue-600 opacity-60">
              Development
            </div>
            <div className="absolute top-2 right-2 text-xs font-medium text-green-600 opacity-60">
              Growth
            </div>
            <div className="absolute bottom-2 left-2 text-xs font-medium text-red-600 opacity-60">
              Weed Off
            </div>
            <div className="absolute bottom-2 right-2 text-xs font-medium text-amber-600 opacity-60">
              Survivor
            </div>

            {/* Center lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />

            {/* Skill Points */}
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`absolute w-8 h-8 -ml-4 -mb-4 rounded-full flex items-center justify-center text-xs font-medium cursor-${
                  readonly ? "default" : "grab"
                } transition-shadow ${
                  draggingSkill === skill.id ? "shadow-lg z-10" : ""
                } ${
                  selectedSkill?.id === skill.id
                    ? "ring-2 ring-purple-500 ring-offset-2"
                    : ""
                }`}
                style={{
                  left: `${skill.knowledge}%`,
                  bottom: `${skill.passion}%`,
                  backgroundColor:
                    getQuadrant(skill.knowledge, skill.passion) === "growth"
                      ? "#22c55e"
                      : getQuadrant(skill.knowledge, skill.passion) === "development"
                      ? "#3b82f6"
                      : getQuadrant(skill.knowledge, skill.passion) === "survivor"
                      ? "#f59e0b"
                      : "#ef4444",
                  color: "white",
                }}
                onMouseDown={(e) => handleDrag(e, skill.id)}
                onClick={() => setSelectedSkill(skill)}
                title={`${skill.name}: K=${skill.knowledge}%, P=${skill.passion}%`}
              >
                {skill.name.substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Skill Details */}
        {selectedSkill && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-forest-800">
                {selectedSkill.name}
              </h4>
              {!readonly && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveSkill(selectedSkill.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Knowledge:</span>{" "}
                <span className="font-medium">{selectedSkill.knowledge}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Passion:</span>{" "}
                <span className="font-medium">{selectedSkill.passion}%</span>
              </div>
            </div>
            <div className="mt-2">
              <Badge
                className={`${
                  quadrantInfo[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)]
                    .color
                } ${
                  quadrantInfo[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)]
                    .textColor
                }`}
              >
                {quadrantInfo[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)].name}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {quadrantInfo[getQuadrant(selectedSkill.knowledge, selectedSkill.passion)].recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Quadrant Summary */}
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(quadrantInfo) as Array<keyof typeof quadrantInfo>).map(
            (quadrant) => (
              <div
                key={quadrant}
                className={`p-3 rounded-lg border ${quadrantInfo[quadrant].color}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${quadrantInfo[quadrant].textColor}`}
                  >
                    {quadrantInfo[quadrant].name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {skillsByQuadrant[quadrant].length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillsByQuadrant[quadrant].slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="text-xs px-2 py-0.5 bg-white/50 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {skillsByQuadrant[quadrant].length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{skillsByQuadrant[quadrant].length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {!readonly && (
          <p className="text-xs text-center text-muted-foreground">
            <GripVertical className="w-3 h-3 inline mr-1" />
            Drag skills to reposition them on the matrix
          </p>
        )}
      </CardContent>
    </Card>
  )
}
