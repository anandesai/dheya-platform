"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Hero Section */}
      <section className="bg-charcoal-900 border-b border-charcoal-800 pt-24 pb-32">
        <div className="container-uplift text-center max-w-4xl mx-auto">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-[#5D5FEF] mb-6 block">We&apos;re Here For You</span>
          <h1 className="text-display text-white mb-8 leading-[0.85]">
            LET&apos;S START YOUR <br /> TRANSFORMATION
          </h1>
          <p className="font-body text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Whether you have questions about our programs or just need clarity on your next step, our team is ready to listen.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative px-4 pb-20 -mt-20">
        <div className="container-uplift bg-white p-8 md:p-12 border border-charcoal-900/10 shadow-xl max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="text-display-sm text-charcoal-900 mb-2">SEND US A MESSAGE</h2>
              <p className="font-body text-charcoal-600">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-900">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} disabled={isSubmitting} className="rounded-none border-charcoal-300 focus:border-purple-600 focus:ring-purple-600 bg-[#FDF8F0] h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-900">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} disabled={isSubmitting} className="rounded-none border-charcoal-300 focus:border-purple-600 focus:ring-purple-600 bg-[#FDF8F0] h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-900">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 000-0000" {...field} disabled={isSubmitting} className="rounded-none border-charcoal-300 focus:border-purple-600 focus:ring-purple-600 bg-[#FDF8F0] h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="segment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-900">I am a...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-charcoal-300 focus:border-purple-600 bg-[#FDF8F0] h-12">
                              <SelectValue placeholder="Select Segment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {segments.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-900">Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us how we can help..." {...field} disabled={isSubmitting} className="rounded-none border-charcoal-300 focus:border-purple-600 bg-[#FDF8F0] min-h-[150px] resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="rounded-full bg-[#5D5FEF] text-white hover:bg-purple-700 px-10 py-6 font-display font-bold text-sm tracking-widest uppercase w-full md:w-auto">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-10 lg:pl-10 lg:border-l lg:border-charcoal-100">
            <div>
              <h3 className="font-display font-bold text-xl uppercase mb-6">Contact Info</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#C8D1A3] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-charcoal-900" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold uppercase text-charcoal-500 mb-1">Email</p>
                    <a href="mailto:info@dheya.com" className="font-body text-lg text-charcoal-900 hover:text-purple-600">info@dheya.com</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#C8D1A3] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-charcoal-900" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold uppercase text-charcoal-500 mb-1">Phone</p>
                    <a href="tel:+919923400555" className="font-body text-lg text-charcoal-900 hover:text-purple-600">+91 99234 00555</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#C8D1A3] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-charcoal-900" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold uppercase text-charcoal-500 mb-1">HQ</p>
                    <p className="font-body text-lg text-charcoal-900">Pune, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-charcoal-100">
              <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Office Hours
              </h3>
              <div className="space-y-3 font-body text-charcoal-700">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-bold">10:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-bold">10:00 AM - 2:00 PM IST</span>
                </div>
                <div className="flex justify-between text-charcoal-400">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F7EFE5]">
        <div className="container-uplift max-w-4xl mx-auto">
          <h2 className="text-display-sm text-charcoal-900 text-center mb-12">COMMON QUESTIONS</h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border text-charcoal-900 px-6">
                <AccordionTrigger className="font-display font-bold uppercase text-left hover:text-purple-600">{faq.question}</AccordionTrigger>
                <AccordionContent className="font-body text-charcoal-700 pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
