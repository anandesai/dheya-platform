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
  { value: "early-career", label: "Early Career (22-30)" },
  { value: "mid-career", label: "Mid-Career (30-45)" },
  { value: "senior", label: "Senior (45+)" },
  { value: "returning", label: "Returning Professional" },
  { value: "exploring", label: "Just Exploring" },
]

const faqs = [
  {
    question: "Is this discovery call actually free? No hidden catches?",
    answer:
      "Zero cost. No credit card. 30 minutes of genuine career conversation. If we're not the right fit, we'll tell you—and point you toward better options. We'd rather lose a sale than waste your time.",
  },
  {
    question: "I'm not sure I'm ready for mentoring. Should I still reach out?",
    answer:
      "That uncertainty is exactly why you should. Most people we help started with 'I'm not sure.' The discovery call exists to help you figure out if now is the right time. No pressure, just clarity.",
  },
  {
    question: "How long before I hear back?",
    answer:
      "Within 24 hours on business days. Usually faster. We know career decisions feel urgent—we treat them that way.",
  },
  {
    question: "What happens after I submit this form?",
    answer:
      "You'll get a confirmation email immediately. Within 24 hours, a real human (not a bot) will reach out to schedule your discovery call. On that call, we'll understand your situation and recommend next steps—which might not even involve us.",
  },
  {
    question: "I've tried career coaching before. How is this different?",
    answer:
      "Most coaching is generic advice + motivation. We use evidence-based assessments to diagnose your specific situation, then match you with a mentor who's navigated similar challenges. It's closer to therapy for your career than cheerleading.",
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
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-purple-400 mb-6 block">The First Step Is The Hardest</span>
          <h1 className="text-display text-white mb-8 leading-[0.85]">
            ONE CONVERSATION <br /> <span className="text-purple-400">COULD CHANGE EVERYTHING</span>
          </h1>
          <p className="font-body text-xl text-cream-300 leading-relaxed max-w-2xl mx-auto">
            Not a sales pitch. Not a chatbot. A real conversation with someone who gets it. 30 minutes to explore whether Dheya is right for you. Zero pressure. Free discovery call.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative px-4 pb-20 -mt-20">
        <div className="container-uplift bg-white p-8 md:p-12 border border-charcoal-900/10 shadow-xl max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="text-display-sm text-charcoal-900 mb-2">TELL US YOUR STORY</h2>
              <p className="font-body text-charcoal-600 text-lg">Where are you? Where do you want to be? We&apos;ll respond within 24 hours—usually sooner.</p>
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
                      <FormLabel className="font-headline text-xs uppercase tracking-widest font-bold text-charcoal-900">What&apos;s on your mind?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Be honest. What's keeping you up at night about your career? The more you share, the more we can help..." {...field} disabled={isSubmitting} className="rounded-none border-charcoal-300 focus:border-purple-600 bg-[#FDF8F0] min-h-[150px] resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="rounded-full bg-purple-600 text-white hover:bg-purple-700 px-10 py-6 font-headline font-bold text-sm tracking-widest uppercase w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
                  {isSubmitting ? "Sending..." : "Start The Conversation →"}
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
