import {
  AssessmentResponse,
  ScoringConfig,
  DimensionScore,
  AssessmentResult,
  Question,
} from "./assessment-types"

export function calculateDimensionScore(
  responses: AssessmentResponse[],
  questions: Question[],
  dimensionKey: string,
  questionIds: string[]
): DimensionScore {
  let totalScore = 0
  let maxScore = 0

  for (const questionId of questionIds) {
    const response = responses.find((r) => r.questionId === questionId)
    const question = questions.find((q) => q.id === questionId)

    if (!response || !question) continue

    // Get the numeric value from response
    let value = typeof response.value === "number" ? response.value : 0

    // For likert scales, assume 1-5 range
    if (question.type === "likert") {
      maxScore += 5

      // Handle reverse scoring
      if (question.scoring?.reverseScored) {
        value = 6 - value // Reverse: 5->1, 4->2, 3->3, 2->4, 1->5
      }

      totalScore += value
    } else if (question.type === "rating-scale") {
      const max = question.validation?.max || 100
      maxScore += max
      totalScore += value
    } else if (question.type === "single-select") {
      // For single select, use the value directly
      maxScore += question.options?.length || 5
      const optionValue = question.options?.find(o => o.id === response.value)?.value
      totalScore += typeof optionValue === "number" ? optionValue : 0
    }
  }

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return {
    dimension: dimensionKey,
    score: totalScore,
    maxScore,
    percentage,
    level: getScoreLevel(percentage),
  }
}

export function getScoreLevel(percentage: number): string {
  if (percentage <= 25) return "Low"
  if (percentage <= 50) return "Moderate"
  if (percentage <= 75) return "High"
  return "Very High"
}

export function calculateAssessmentResult(
  assessmentId: string,
  userId: string,
  responses: AssessmentResponse[],
  questions: Question[],
  config: ScoringConfig
): AssessmentResult {
  const dimensionScores: DimensionScore[] = []
  let totalScore = 0
  let totalMaxScore = 0

  // Calculate scores for each dimension
  for (const dimension of config.dimensions) {
    const score = calculateDimensionScore(
      responses,
      questions,
      dimension.key,
      dimension.questionIds
    )

    // Apply dimension weight
    const weightedScore = score.score * dimension.weight
    const weightedMax = score.maxScore * dimension.weight

    dimensionScores.push({
      ...score,
      score: Math.round(weightedScore),
      maxScore: Math.round(weightedMax),
    })

    totalScore += weightedScore
    totalMaxScore += weightedMax
  }

  // Determine overall level based on thresholds
  const totalPercentage = totalMaxScore > 0
    ? (totalScore / totalMaxScore) * 100
    : 0

  let overallLevel = "Unknown"
  let recommendations: string[] = []

  for (const threshold of config.thresholds) {
    if (totalPercentage >= threshold.min && totalPercentage <= threshold.max) {
      overallLevel = threshold.level
      recommendations = [threshold.recommendation]
      break
    }
  }

  // Add dimension-specific recommendations
  for (const score of dimensionScores) {
    if (score.percentage > 70) {
      recommendations.push(
        `High score in ${score.dimension} - this area needs attention.`
      )
    }
  }

  return {
    assessmentId,
    userId,
    responses,
    dimensionScores,
    totalScore: Math.round(totalScore),
    totalMaxScore: Math.round(totalMaxScore),
    overallLevel,
    recommendations,
    completedAt: new Date(),
  }
}

// BBD-specific scoring
export function calculateBBDScore(responses: AssessmentResponse[]): {
  bored: number
  burnedOut: number
  dissatisfied: number
  total: number
  level: string
} {
  // Group responses by dimension based on question ID prefixes
  const boredQuestions = responses.filter((r) => r.questionId.startsWith("bored-"))
  const burnedOutQuestions = responses.filter((r) => r.questionId.startsWith("burnout-"))
  const dissatisfiedQuestions = responses.filter((r) => r.questionId.startsWith("dissatisfied-"))

  const sumResponses = (items: AssessmentResponse[]) =>
    items.reduce((sum, r) => sum + (typeof r.value === "number" ? r.value : 0), 0)

  const bored = sumResponses(boredQuestions)
  const burnedOut = sumResponses(burnedOutQuestions)
  const dissatisfied = sumResponses(dissatisfiedQuestions)
  const total = bored + burnedOut + dissatisfied

  // BBD scoring levels
  let level: string
  if (total <= 15) level = "Low"
  else if (total <= 30) level = "Moderate"
  else if (total <= 45) level = "High"
  else level = "Critical"

  return { bored, burnedOut, dissatisfied, total, level }
}

// Work Values scoring
export function calculateValuesAlignment(
  selectedValues: string[],
  valueRatings: Record<string, number>,
  valueWeights: Record<string, number>
): {
  alignmentScore: number
  topAligned: { value: string; score: number }[]
  lowAligned: { value: string; score: number }[]
} {
  let weightedSum = 0
  let totalWeight = 0
  const alignmentDetails: { value: string; score: number; weight: number }[] = []

  for (const value of selectedValues) {
    const rating = valueRatings[value] || 0
    const weight = valueWeights[value] || 0

    weightedSum += rating * (weight / 100)
    totalWeight += weight / 100

    alignmentDetails.push({ value, score: rating, weight })
  }

  const alignmentScore = totalWeight > 0
    ? Math.round(weightedSum / totalWeight)
    : 0

  // Sort for top and low aligned
  const sorted = [...alignmentDetails].sort((a, b) => b.score - a.score)
  const topAligned = sorted.slice(0, 3).map(({ value, score }) => ({ value, score }))
  const lowAligned = sorted.slice(-3).map(({ value, score }) => ({ value, score }))

  return { alignmentScore, topAligned, lowAligned }
}
