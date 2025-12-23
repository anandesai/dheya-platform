import { Assessment } from "../assessment-types"

export const bbdAssessment: Assessment = {
  id: "bbd-assessment",
  code: "BBD-001",
  name: "BBD Syndrome Assessment",
  description:
    "Identify if you're experiencing Boredom, Burnout, or Dissatisfaction in your career. This assessment helps pinpoint the root cause of your career stagnation.",
  category: "assessment",
  estimatedTime: 15,
  sections: [
    {
      id: "bored-section",
      title: "Boredom Indicators",
      description:
        "These questions assess feelings of monotony, lack of challenge, and disengagement at work.",
      questions: [
        {
          id: "bored-1",
          type: "likert",
          text: "I find my daily work tasks repetitive and uninteresting.",
          required: true,
          scoring: { dimension: "bored", weight: 1 },
        },
        {
          id: "bored-2",
          type: "likert",
          text: "I rarely encounter new challenges that require me to learn or grow.",
          required: true,
          scoring: { dimension: "bored", weight: 1 },
        },
        {
          id: "bored-3",
          type: "likert",
          text: "Time seems to pass very slowly during my workday.",
          required: true,
          scoring: { dimension: "bored", weight: 1 },
        },
        {
          id: "bored-4",
          type: "likert",
          text: "I often feel underutilized and that my skills are not being fully tapped.",
          required: true,
          scoring: { dimension: "bored", weight: 1 },
        },
        {
          id: "bored-5",
          type: "likert",
          text: "I find myself daydreaming or distracted frequently during work hours.",
          required: true,
          scoring: { dimension: "bored", weight: 1 },
        },
      ],
    },
    {
      id: "burnout-section",
      title: "Burnout Indicators",
      description:
        "These questions assess exhaustion, cynicism, and reduced professional efficacy.",
      questions: [
        {
          id: "burnout-1",
          type: "likert",
          text: "I feel emotionally drained and exhausted by my work.",
          required: true,
          scoring: { dimension: "burnedOut", weight: 1 },
        },
        {
          id: "burnout-2",
          type: "likert",
          text: "I have become more cynical about the value of my work.",
          required: true,
          scoring: { dimension: "burnedOut", weight: 1 },
        },
        {
          id: "burnout-3",
          type: "likert",
          text: "I find it difficult to recover my energy even after rest or vacation.",
          required: true,
          scoring: { dimension: "burnedOut", weight: 1 },
        },
        {
          id: "burnout-4",
          type: "likert",
          text: "I feel like I'm just going through the motions at work.",
          required: true,
          scoring: { dimension: "burnedOut", weight: 1 },
        },
        {
          id: "burnout-5",
          type: "likert",
          text: "My work-life balance has significantly deteriorated.",
          required: true,
          scoring: { dimension: "burnedOut", weight: 1 },
        },
      ],
    },
    {
      id: "dissatisfied-section",
      title: "Dissatisfaction Indicators",
      description:
        "These questions assess misalignment with values, lack of recognition, and career frustration.",
      questions: [
        {
          id: "dissatisfied-1",
          type: "likert",
          text: "I feel my work doesn't align with my personal values or purpose.",
          required: true,
          scoring: { dimension: "dissatisfied", weight: 1 },
        },
        {
          id: "dissatisfied-2",
          type: "likert",
          text: "I don't feel recognized or appreciated for my contributions.",
          required: true,
          scoring: { dimension: "dissatisfied", weight: 1 },
        },
        {
          id: "dissatisfied-3",
          type: "likert",
          text: "I see limited opportunities for growth or advancement in my current role.",
          required: true,
          scoring: { dimension: "dissatisfied", weight: 1 },
        },
        {
          id: "dissatisfied-4",
          type: "likert",
          text: "My compensation doesn't reflect the value I bring to the organization.",
          required: true,
          scoring: { dimension: "dissatisfied", weight: 1 },
        },
        {
          id: "dissatisfied-5",
          type: "likert",
          text: "I often think about leaving my current job for something better.",
          required: true,
          scoring: { dimension: "dissatisfied", weight: 1 },
        },
      ],
    },
    {
      id: "impact-section",
      title: "Impact on Life",
      description:
        "These questions assess how your career situation is affecting other areas of your life.",
      questions: [
        {
          id: "impact-1",
          type: "likert",
          text: "My work situation is negatively affecting my personal relationships.",
          required: true,
          scoring: { dimension: "impact", weight: 1 },
        },
        {
          id: "impact-2",
          type: "likert",
          text: "I experience physical symptoms (headaches, fatigue, sleep issues) related to work stress.",
          required: true,
          scoring: { dimension: "impact", weight: 1 },
        },
        {
          id: "impact-3",
          type: "likert",
          text: "I have lost interest in hobbies or activities I used to enjoy.",
          required: true,
          scoring: { dimension: "impact", weight: 1 },
        },
        {
          id: "impact-4",
          type: "likert",
          text: "I feel anxious or depressed about my career situation.",
          required: true,
          scoring: { dimension: "impact", weight: 1 },
        },
        {
          id: "impact-5",
          type: "likert",
          text: "I question my career choices and wonder if I made the right decisions.",
          required: true,
          scoring: { dimension: "impact", weight: 1 },
        },
      ],
    },
    {
      id: "reflection-section",
      title: "Reflection",
      description: "Share your thoughts to help us personalize your recommendations.",
      questions: [
        {
          id: "reflection-1",
          type: "open-text",
          text: "What specific aspects of your current work situation concern you the most?",
          helpText: "Be as specific as possible about your challenges.",
          required: false,
          validation: { minLength: 20, maxLength: 500 },
        },
        {
          id: "reflection-2",
          type: "open-text",
          text: "What would your ideal work situation look like?",
          helpText: "Describe what success means to you.",
          required: false,
          validation: { minLength: 20, maxLength: 500 },
        },
      ],
    },
  ],
  scoringConfig: {
    dimensions: [
      {
        name: "Boredom",
        key: "bored",
        description: "Feeling unchallenged and disengaged",
        weight: 1,
        questionIds: ["bored-1", "bored-2", "bored-3", "bored-4", "bored-5"],
      },
      {
        name: "Burnout",
        key: "burnedOut",
        description: "Exhaustion and cynicism from work",
        weight: 1,
        questionIds: [
          "burnout-1",
          "burnout-2",
          "burnout-3",
          "burnout-4",
          "burnout-5",
        ],
      },
      {
        name: "Dissatisfaction",
        key: "dissatisfied",
        description: "Misalignment with values and expectations",
        weight: 1,
        questionIds: [
          "dissatisfied-1",
          "dissatisfied-2",
          "dissatisfied-3",
          "dissatisfied-4",
          "dissatisfied-5",
        ],
      },
      {
        name: "Life Impact",
        key: "impact",
        description: "Effect on personal life and wellbeing",
        weight: 0.5,
        questionIds: [
          "impact-1",
          "impact-2",
          "impact-3",
          "impact-4",
          "impact-5",
        ],
      },
    ],
    thresholds: [
      {
        level: "Low",
        min: 0,
        max: 25,
        description: "Minimal BBD symptoms",
        recommendation:
          "Your career health is good. Focus on maintaining engagement and preventing future stagnation.",
      },
      {
        level: "Moderate",
        min: 26,
        max: 50,
        description: "Some BBD symptoms present",
        recommendation:
          "You're showing early signs of career stagnation. Consider proactive steps to realign your career.",
      },
      {
        level: "High",
        min: 51,
        max: 75,
        description: "Significant BBD symptoms",
        recommendation:
          "Your career health needs attention. A structured intervention with a mentor is recommended.",
      },
      {
        level: "Critical",
        min: 76,
        max: 100,
        description: "Severe BBD symptoms",
        recommendation:
          "Immediate action is needed. Consider intensive mentorship and possibly exploring career alternatives.",
      },
    ],
    totalScoreRange: {
      min: 0,
      max: 100,
    },
  },
}
