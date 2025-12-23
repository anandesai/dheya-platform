import { Assessment } from "../assessment-types"

export const workValues = [
  { id: "achievement", label: "Achievement", description: "Accomplishing goals and seeing results" },
  { id: "autonomy", label: "Autonomy", description: "Having independence and freedom in work" },
  { id: "balance", label: "Work-Life Balance", description: "Harmony between work and personal life" },
  { id: "challenge", label: "Challenge", description: "Solving complex problems and continuous learning" },
  { id: "collaboration", label: "Collaboration", description: "Working with others towards common goals" },
  { id: "compensation", label: "Compensation", description: "Fair pay and financial rewards" },
  { id: "creativity", label: "Creativity", description: "Expressing ideas and innovation" },
  { id: "growth", label: "Growth", description: "Opportunities for learning and advancement" },
  { id: "impact", label: "Impact", description: "Making a difference and contributing to society" },
  { id: "leadership", label: "Leadership", description: "Guiding others and influencing decisions" },
  { id: "recognition", label: "Recognition", description: "Being appreciated for contributions" },
  { id: "security", label: "Security", description: "Job stability and predictable future" },
  { id: "variety", label: "Variety", description: "Diverse tasks and changing responsibilities" },
  { id: "purpose", label: "Purpose", description: "Meaningful work aligned with personal values" },
  { id: "relationships", label: "Relationships", description: "Building connections with colleagues" },
  { id: "expertise", label: "Expertise", description: "Becoming an expert in your field" },
]

export const workValuesAssessment: Assessment = {
  id: "work-values",
  code: "WV-001",
  name: "Work Values Assessment",
  description:
    "Discover your core work values and measure how well they align with your current role. This assessment helps identify what truly matters to you in your career.",
  category: "assessment",
  estimatedTime: 20,
  sections: [
    {
      id: "selection",
      title: "Value Selection",
      description:
        "From the list below, select the 10 values that are most important to you in your work life.",
      questions: [
        {
          id: "top-values",
          type: "multi-select",
          text: "Select your top 10 work values",
          helpText: "Choose values that resonate most deeply with what you want from your career.",
          required: true,
          options: workValues.map((v) => ({
            id: v.id,
            label: v.label,
            value: v.id,
            description: v.description,
          })),
        },
      ],
    },
    {
      id: "prioritization",
      title: "Value Prioritization",
      description:
        "Now narrow down to your top 5 core values. These are the non-negotiables in your career.",
      questions: [
        {
          id: "core-values",
          type: "multi-select",
          text: "Select your 5 core values from your previous selection",
          helpText: "These should be the values you absolutely cannot compromise on.",
          required: true,
          options: [], // Will be dynamically populated based on previous selection
        },
      ],
    },
    {
      id: "weighting",
      title: "Value Weighting",
      description:
        "Assign importance weights to your 5 core values. The total must equal 100%.",
      questions: [
        // Questions will be dynamically generated based on selected core values
        {
          id: "weight-placeholder",
          type: "rating-scale",
          text: "This will be replaced with actual value weighting questions",
          required: true,
        },
      ],
    },
    {
      id: "alignment",
      title: "Current Role Alignment",
      description:
        "Rate how well your current role fulfills each of your core values.",
      questions: [
        // Questions will be dynamically generated based on selected core values
        {
          id: "alignment-placeholder",
          type: "rating-scale",
          text: "This will be replaced with alignment rating questions",
          required: true,
        },
      ],
    },
    {
      id: "reflection",
      title: "Reflection",
      description: "Share your thoughts on your values alignment.",
      questions: [
        {
          id: "reflection-gaps",
          type: "open-text",
          text: "What aspects of your current role create the biggest gap with your values?",
          required: false,
          validation: { minLength: 20, maxLength: 500 },
        },
        {
          id: "reflection-ideal",
          type: "open-text",
          text: "Describe a work situation where your values would be fully honored.",
          required: false,
          validation: { minLength: 20, maxLength: 500 },
        },
      ],
    },
  ],
  scoringConfig: {
    dimensions: [
      {
        name: "Values Clarity",
        key: "clarity",
        description: "How clear you are about your work values",
        weight: 0.3,
        questionIds: ["top-values", "core-values"],
      },
      {
        name: "Alignment Score",
        key: "alignment",
        description: "How well your current role matches your values",
        weight: 0.7,
        questionIds: [], // Dynamically populated
      },
    ],
    thresholds: [
      {
        level: "Strong Alignment",
        min: 75,
        max: 100,
        description: "Your role strongly aligns with your values",
        recommendation:
          "Continue nurturing this alignment. Look for ways to deepen your connection to your top values.",
      },
      {
        level: "Moderate Alignment",
        min: 50,
        max: 74,
        description: "Some values are met, others are lacking",
        recommendation:
          "Identify the 1-2 values with lowest alignment and explore ways to improve them within your current role.",
      },
      {
        level: "Low Alignment",
        min: 25,
        max: 49,
        description: "Significant gaps between your values and role",
        recommendation:
          "Consider discussing role adjustments with your manager or exploring internal mobility options.",
      },
      {
        level: "Critical Misalignment",
        min: 0,
        max: 24,
        description: "Major disconnect between values and work",
        recommendation:
          "A career transition may be necessary. Work with a mentor to explore alternatives.",
      },
    ],
    totalScoreRange: {
      min: 0,
      max: 100,
    },
  },
}
