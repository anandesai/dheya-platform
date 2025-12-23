export const siteConfig = {
  name: "Dheya Career Mentors",
  shortName: "Dheya",
  tagline: "Transform Your Career Journey",
  description:
    "India's premier career mentoring platform. 18+ years of expertise, 100,000+ professionals mentored.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://dheya.com",

  // Contact information
  contact: {
    email: "contact@dheya.com",
    phone: "+91 XXXXXXXXXX",
    address: "Mumbai, India",
  },

  // Social links
  social: {
    linkedin: "https://linkedin.com/company/dheya",
    twitter: "https://twitter.com/dheya",
    instagram: "https://instagram.com/dheya",
    youtube: "https://youtube.com/dheya",
  },

  // Trust signals
  stats: {
    yearsOfExperience: 18,
    professionalsMentored: 100000,
    clarityRate: 91,
    clientSatisfaction: 95,
  },

  // Program segments
  segments: {
    EARLY_CAREER: {
      name: "Early Career",
      program: "Develop Advantage",
      ageRange: "22-30",
      description: "Foundation for career success",
    },
    MID_CAREER: {
      name: "Mid-Career",
      program: "Destination Mastery",
      ageRange: "30-45",
      description: "Navigate complexity with clarity",
    },
    SENIOR: {
      name: "Senior Professionals",
      program: "Design Legacy",
      ageRange: "45+",
      description: "Design your second innings",
    },
    RETURNING_WOMEN: {
      name: "Returning Women",
      program: "Rise Again",
      ageRange: "Any",
      description: "Restart your career journey",
    },
  },

  // Package tiers
  tiers: {
    GUIDANCE: {
      name: "Guidance",
      description: "Self-paced exploration",
      features: ["Phase 1-2 access", "Basic assessments", "Community support"],
    },
    PLANNING: {
      name: "Planning",
      description: "Structured development",
      features: [
        "Phase 1-5 access",
        "All assessments",
        "3 mentor sessions",
        "Personalized roadmap",
      ],
    },
    MENTORSHIP: {
      name: "Mentorship",
      description: "Complete transformation",
      features: [
        "All phases",
        "Priority assessments",
        "6 mentor sessions",
        "1:1 coaching",
        "Career action plan",
      ],
    },
  },

  // Phase names
  phases: [
    "Discovery",
    "Assessment",
    "Planning",
    "Development",
    "Action",
    "Integration",
  ],

  // Navigation links
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Programs", href: "/programs" },
      { name: "Mentors", href: "/mentors" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    programs: [
      { name: "Early Career", href: "/programs/early-career" },
      { name: "Mid-Career", href: "/programs/mid-career" },
      { name: "Senior", href: "/programs/senior" },
      { name: "Returning Women", href: "/programs/returning-women" },
    ],
    dashboard: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Assessments", href: "/assessments" },
      { name: "Sessions", href: "/sessions" },
      { name: "Progress", href: "/progress" },
    ],
    admin: [
      { name: "Overview", href: "/admin" },
      { name: "Tools", href: "/admin/tools" },
      { name: "Packages", href: "/admin/packages" },
      { name: "Mentors", href: "/admin/mentors" },
      { name: "Analytics", href: "/admin/analytics" },
    ],
  },
}

export type Segment = keyof typeof siteConfig.segments
export type Tier = keyof typeof siteConfig.tiers
