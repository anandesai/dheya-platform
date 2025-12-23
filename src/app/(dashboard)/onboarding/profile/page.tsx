"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Briefcase,
  GraduationCap,
  Target,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

const industries = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Consulting",
  "Marketing & Advertising",
  "Media & Entertainment",
  "Real Estate",
  "Retail & E-commerce",
  "Government & Public Sector",
  "Non-Profit",
  "Other",
]

const experienceLevels = [
  "0-2 years",
  "3-5 years",
  "6-10 years",
  "11-15 years",
  "16-20 years",
  "20+ years",
]

const educationLevels = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certification",
  "Other",
]

export default function ProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    currentRole: "",
    company: "",
    industry: "",
    experience: "",
    education: "",
    linkedIn: "",
    goals: "",
    challenges: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Save profile data via API
    // For now, store in localStorage and redirect
    localStorage.setItem("userProfile", JSON.stringify(formData))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    router.push("/onboarding/package-selection")
  }

  const isFormValid = formData.currentRole && formData.industry && formData.experience

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-charcoal-600 font-body">Step 2 of 4</span>
          <span className="text-sm font-medium text-purple-600">50% Complete</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      <Card variant="light" className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-charcoal-800 flex items-center gap-2">
            <User className="h-6 w-6 text-purple-600" />
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Help us understand you better to personalize your mentoring journey.
            Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="bg-cream-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai, Bangalore, Delhi"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role *</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.currentRole}
                    onChange={(e) => handleChange("currentRole", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Infosys, TCS, Startup"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleChange("industry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => handleChange("experience", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Education & LinkedIn */}
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education & Social
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Highest Education</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) => handleChange("education", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <Input
                    id="linkedIn"
                    placeholder="linkedin.com/in/yourprofile"
                    value={formData.linkedIn}
                    onChange={(e) => handleChange("linkedIn", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Goals & Challenges */}
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals & Challenges
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">What are your career goals?</Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe what you hope to achieve through mentoring..."
                    value={formData.goals}
                    onChange={(e) => handleChange("goals", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenges">What challenges are you facing?</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Share the obstacles or questions you're dealing with..."
                    value={formData.challenges}
                    onChange={(e) => handleChange("challenges", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/onboarding/segment-quiz")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isSubmitting ? "Saving..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
