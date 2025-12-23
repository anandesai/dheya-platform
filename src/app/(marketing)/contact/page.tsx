"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  segment: z.string().min(1, "Please select a segment"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

const segments = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Working Professional" },
  { value: "career-changer", label: "Career Changer" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "parent", label: "Parent/Guardian" },
  { value: "other", label: "Other" },
]

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.",
  },
  {
    question: "What services does Dheya Career Mentors offer?",
    answer:
      "We provide personalized career mentorship, resume reviews, interview preparation, career transition guidance, and skill development programs tailored to your specific needs and goals.",
  },
  {
    question: "How do I schedule a mentoring session?",
    answer:
      "After submitting this contact form, our team will reach out to understand your needs and help you book a session with the most suitable mentor for your career goals.",
  },
  {
    question: "Do you offer group sessions or workshops?",
    answer:
      "Yes, we conduct regular workshops on various career development topics. Please mention your interest in group sessions in the message field, and we'll send you our upcoming schedule.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We require at least 24 hours notice for cancellations. Sessions cancelled with less notice may be subject to a fee. Please refer to our terms of service for complete details.",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      segment: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      toast.success("Message sent successfully! We'll get back to you soon.")
      form.reset()
    } catch {
      toast.error("Failed to send message. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 text-cream-50 py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
            GET IN TOUCH
          </h1>
          <p className="text-lg md:text-xl font-body text-cream-100 max-w-2xl mx-auto">
            Have questions about your career journey? We&apos;re here to help you
            navigate your path to success.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card variant="light" className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-display text-charcoal-800">
                    Send Us a Message
                  </CardTitle>
                  <CardDescription className="font-body text-charcoal-600">
                    Fill out the form below and we&apos;ll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-display text-sm text-charcoal-700">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                disabled={isSubmitting}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-display text-sm text-charcoal-700">
                                Email Address *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  {...field}
                                  disabled={isSubmitting}
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-display text-sm text-charcoal-700">
                                Phone Number *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+1 (555) 123-4567"
                                  {...field}
                                  disabled={isSubmitting}
                                  className="bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="segment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-display text-sm text-charcoal-700">
                              I am a *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select your segment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {segments.map((segment) => (
                                  <SelectItem
                                    key={segment.value}
                                    value={segment.value}
                                  >
                                    {segment.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-display text-sm text-charcoal-700">
                              Message *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your career goals and how we can help..."
                                className="min-h-[150px] bg-white resize-none"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        variant="uplift"
                        className="w-full md:w-auto px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card variant="light" className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-display text-charcoal-800">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-charcoal-600 mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:info@dheyamentors.com"
                        className="font-body text-charcoal-800 hover:text-purple-600 transition-colors"
                      >
                        info@dheyamentors.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-charcoal-600 mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+15551234567"
                        className="font-body text-charcoal-800 hover:text-purple-600 transition-colors"
                      >
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-charcoal-600 mb-1">
                        Address
                      </p>
                      <p className="font-body text-charcoal-800">
                        123 Career Way, Suite 100
                        <br />
                        San Francisco, CA 94102
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card variant="light" className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-display text-charcoal-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Monday - Friday</span>
                    <span className="text-charcoal-800 font-medium">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Saturday</span>
                    <span className="text-charcoal-800 font-medium">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Sunday</span>
                    <span className="text-charcoal-800 font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-cream-200">
                    <p className="text-charcoal-600 text-xs">
                      * Times are in Pacific Standard Time (PST)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg font-body text-charcoal-600">
              Find quick answers to common questions about our services
            </p>
          </div>

          <Card variant="light" className="shadow-lg">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-cream-200 last:border-0"
                  >
                    <AccordionTrigger className="font-display text-charcoal-800 hover:text-purple-600 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-charcoal-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="font-body text-charcoal-600">
              Still have questions?{" "}
              <a
                href="mailto:info@dheyamentors.com"
                className="font-medium text-purple-600 hover:text-purple-700 hover:underline"
              >
                Contact us directly
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
