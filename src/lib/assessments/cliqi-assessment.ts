import { Assessment } from "../assessment-types"

export const cliqiAssessment: Assessment = {
  id: "cliqi-assessment",
  code: "CLIQI-001",
  name: "CLIQI Assessment",
  description:
    "Measure your Career Life Intelligence Quotient across five key dimensions: Self-Awareness, Opportunity Awareness, Goal Clarity, Planning Capability, and Decision Confidence.",
  category: "assessment",
  estimatedTime: 10,
  sections: [
    {
      id: "self-awareness-section",
      title: "Self-Awareness",
      description:
        "Understanding your values, strengths, interests, and what truly matters to you in your career.",
      questions: [
        {
          id: "sa-1",
          type: "likert",
          text: "I have a clear understanding of my core values and what matters most to me in a career.",
          required: true,
          scoring: { dimension: "selfAwareness", weight: 1 },
        },
        {
          id: "sa-2",
          type: "likert",
          text: "I can easily identify my key strengths and how they contribute to my professional success.",
          required: true,
          scoring: { dimension: "selfAwareness", weight: 1 },
        },
        {
          id: "sa-3",
          type: "likert",
          text: "I understand my natural interests and how they align with potential career paths.",
          required: true,
          scoring: { dimension: "selfAwareness", weight: 1 },
        },
        {
          id: "sa-4",
          type: "likert",
          text: "I am aware of my limitations and areas where I need to develop further.",
          required: true,
          scoring: { dimension: "selfAwareness", weight: 1 },
        },
        {
          id: "sa-5",
          type: "likert",
          text: "I regularly reflect on my experiences to understand what I enjoy and what drains my energy.",
          required: true,
          scoring: { dimension: "selfAwareness", weight: 1 },
        },
      ],
    },
    {
      id: "opportunity-awareness-section",
      title: "Opportunity Awareness",
      description:
        "Knowledge of career options, market trends, and what opportunities exist for your skills and interests.",
      questions: [
        {
          id: "oa-1",
          type: "likert",
          text: "I have a good understanding of the various career paths available in my field of interest.",
          required: true,
          scoring: { dimension: "opportunityAwareness", weight: 1 },
        },
        {
          id: "oa-2",
          type: "likert",
          text: "I stay informed about trends and changes in industries that interest me.",
          required: true,
          scoring: { dimension: "opportunityAwareness", weight: 1 },
        },
        {
          id: "oa-3",
          type: "likert",
          text: "I know what skills and qualifications are valued by employers in my target field.",
          required: true,
          scoring: { dimension: "opportunityAwareness", weight: 1 },
        },
        {
          id: "oa-4",
          type: "likert",
          text: "I actively research and explore different career options before making decisions.",
          required: true,
          scoring: { dimension: "opportunityAwareness", weight: 1 },
        },
        {
          id: "oa-5",
          type: "likert",
          text: "I understand the current job market conditions and how they affect my career opportunities.",
          required: true,
          scoring: { dimension: "opportunityAwareness", weight: 1 },
        },
      ],
    },
    {
      id: "goal-clarity-section",
      title: "Goal Clarity",
      description:
        "Having a clear vision of your career objectives and where you want to be in the future.",
      questions: [
        {
          id: "gc-1",
          type: "likert",
          text: "I have specific, well-defined career goals for the next 1-3 years.",
          required: true,
          scoring: { dimension: "goalClarity", weight: 1 },
        },
        {
          id: "gc-2",
          type: "likert",
          text: "My career goals are realistic and aligned with my values and interests.",
          required: true,
          scoring: { dimension: "goalClarity", weight: 1 },
        },
        {
          id: "gc-3",
          type: "likert",
          text: "I can clearly articulate what success looks like for me professionally.",
          required: true,
          scoring: { dimension: "goalClarity", weight: 1 },
        },
        {
          id: "gc-4",
          type: "likert",
          text: "I have a long-term vision for my career that guides my day-to-day decisions.",
          required: true,
          scoring: { dimension: "goalClarity", weight: 1 },
        },
        {
          id: "gc-5",
          type: "likert",
          text: "I regularly review and update my career goals based on my evolving priorities.",
          required: true,
          scoring: { dimension: "goalClarity", weight: 1 },
        },
      ],
    },
    {
      id: "planning-capability-section",
      title: "Planning Capability",
      description:
        "Your ability to create actionable plans and execute strategies to achieve your career goals.",
      questions: [
        {
          id: "pc-1",
          type: "likert",
          text: "I can break down my career goals into specific, actionable steps.",
          required: true,
          scoring: { dimension: "planningCapability", weight: 1 },
        },
        {
          id: "pc-2",
          type: "likert",
          text: "I create timelines and milestones to track progress toward my career objectives.",
          required: true,
          scoring: { dimension: "planningCapability", weight: 1 },
        },
        {
          id: "pc-3",
          type: "likert",
          text: "I actively seek out resources, connections, and opportunities to advance my career.",
          required: true,
          scoring: { dimension: "planningCapability", weight: 1 },
        },
        {
          id: "pc-4",
          type: "likert",
          text: "I have contingency plans for potential obstacles in my career path.",
          required: true,
          scoring: { dimension: "planningCapability", weight: 1 },
        },
        {
          id: "pc-5",
          type: "likert",
          text: "I consistently follow through on the career development plans I create.",
          required: true,
          scoring: { dimension: "planningCapability", weight: 1 },
        },
      ],
    },
    {
      id: "decision-confidence-section",
      title: "Decision Confidence",
      description:
        "Your confidence in making career decisions and trusting your judgment about professional choices.",
      questions: [
        {
          id: "dc-1",
          type: "likert",
          text: "I feel confident in my ability to make important career decisions.",
          required: true,
          scoring: { dimension: "decisionConfidence", weight: 1 },
        },
        {
          id: "dc-2",
          type: "likert",
          text: "I trust my judgment when evaluating different career opportunities.",
          required: true,
          scoring: { dimension: "decisionConfidence", weight: 1 },
        },
        {
          id: "dc-3",
          type: "likert",
          text: "I can make career decisions without excessive worry or second-guessing.",
          required: true,
          scoring: { dimension: "decisionConfidence", weight: 1 },
        },
        {
          id: "dc-4",
          type: "likert",
          text: "I feel equipped with the information and tools needed to make sound career choices.",
          required: true,
          scoring: { dimension: "decisionConfidence", weight: 1 },
        },
        {
          id: "dc-5",
          type: "likert",
          text: "I am comfortable taking calculated risks when pursuing career opportunities.",
          required: true,
          scoring: { dimension: "decisionConfidence", weight: 1 },
        },
      ],
    },
  ],
  scoringConfig: {
    dimensions: [
      {
        name: "Self-Awareness",
        key: "selfAwareness",
        description: "Understanding of own values, strengths, and interests",
        weight: 1,
        questionIds: ["sa-1", "sa-2", "sa-3", "sa-4", "sa-5"],
      },
      {
        name: "Opportunity Awareness",
        key: "opportunityAwareness",
        description: "Knowledge of career options and market conditions",
        weight: 1,
        questionIds: ["oa-1", "oa-2", "oa-3", "oa-4", "oa-5"],
      },
      {
        name: "Goal Clarity",
        key: "goalClarity",
        description: "Clear vision of career objectives and direction",
        weight: 1,
        questionIds: ["gc-1", "gc-2", "gc-3", "gc-4", "gc-5"],
      },
      {
        name: "Planning Capability",
        key: "planningCapability",
        description: "Ability to create and execute career plans",
        weight: 1,
        questionIds: ["pc-1", "pc-2", "pc-3", "pc-4", "pc-5"],
      },
      {
        name: "Decision Confidence",
        key: "decisionConfidence",
        description: "Confidence in making career decisions",
        weight: 1,
        questionIds: ["dc-1", "dc-2", "dc-3", "dc-4", "dc-5"],
      },
    ],
    thresholds: [
      {
        level: "Developing",
        min: 0,
        max: 40,
        description: "Early stage career intelligence",
        recommendation:
          "Focus on building foundational career awareness. Work with a mentor to develop clarity around your values, goals, and career options.",
      },
      {
        level: "Emerging",
        min: 41,
        max: 60,
        description: "Growing career intelligence",
        recommendation:
          "You're developing good career awareness. Continue strengthening your weakest dimensions and take action on your career plans.",
      },
      {
        level: "Proficient",
        min: 61,
        max: 80,
        description: "Strong career intelligence",
        recommendation:
          "You have solid career intelligence. Focus on execution and maintaining momentum while refining your strategies.",
      },
      {
        level: "Advanced",
        min: 81,
        max: 100,
        description: "Exceptional career intelligence",
        recommendation:
          "You demonstrate exceptional career intelligence. Consider mentoring others and continuing to challenge yourself with ambitious goals.",
      },
    ],
    totalScoreRange: {
      min: 0,
      max: 100,
    },
  },
}
