import type { Metadata } from "next"
import localFont from "next/font/local"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Dheya Career Mentors | Transform Your Career Journey",
  description:
    "India's premier career mentoring platform. 18+ years of expertise, 100,000+ professionals mentored. Discover your path to career clarity and fulfillment.",
  keywords: [
    "career mentoring",
    "career coaching",
    "professional development",
    "career guidance",
    "mid-career transition",
    "career counseling",
    "Dheya",
  ],
  authors: [{ name: "Dheya Career Mentors" }],
  openGraph: {
    title: "Dheya Career Mentors | Transform Your Career Journey",
    description:
      "India's premier career mentoring platform helping professionals discover career clarity and fulfillment.",
    type: "website",
    locale: "en_IN",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
