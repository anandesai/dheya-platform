// Assessment Engine Types

export type QuestionType =
  | "likert"
  | "multi-select"
  | "single-select"
  | "open-text"
  | "rating-scale"
  | "ranking"
  | "matrix"
  | "weighted-selection"

export interface QuestionOption {
  id: string
  label: string
  value: string | number
  description?: string
}

export interface Question {
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
    pattern?: string
  }
  scoring?: {
    dimension: string
    weight: number
    reverseScored?: boolean
  }
}

export interface Section {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export interface Assessment {
  id: string
  code: string
  name: string
  description: string
  category: "assessment" | "workbook" | "framework" | "report" | "exercise"
  estimatedTime: number // in minutes
  sections: Section[]
  scoringConfig: ScoringConfig
}

export interface ScoringConfig {
  dimensions: {
    name: string
    key: string
    description: string
    weight: number
    questionIds: string[]
  }[]
  thresholds: {
    level: string
    min: number
    max: number
    description: string
    recommendation: string
  }[]
  totalScoreRange: {
    min: number
    max: number
  }
}

export interface AssessmentResponse {
  questionId: string
  value: string | number | string[] | number[]
  timestamp: Date
}

export interface DimensionScore {
  dimension: string
  score: number
  maxScore: number
  percentage: number
  level: string
}

export interface AssessmentResult {
  assessmentId: string
  userId: string
  responses: AssessmentResponse[]
  dimensionScores: DimensionScore[]
  totalScore: number
  totalMaxScore: number
  overallLevel: string
  recommendations: string[]
  completedAt: Date
}
