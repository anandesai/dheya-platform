import type { Metadata } from "next"
import { Oswald, Lora } from "next/font/google"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// Display font - Bold condensed for ALL-CAPS headlines (Uplift style)
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

// Body font - Serif for editorial feel (Uplift style)
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Dheya Career Mentors | Transform Your Career Journey",
    template: "%s | Dheya Career Mentors",
  },
  description:
    "India's premier career mentoring platform. 18+ years of expertise, 100,000+ professionals mentored. Discover your path to career clarity and fulfillment.",
  keywords: [
    "career mentoring",
    "career coaching",
    "professional development",
    "career guidance",
    "mid-career transition",
    "career counseling",
    "career assessment",
    "CLIQI",
    "BBD syndrome",
    "work values",
    "Dheya",
  ],
  authors: [{ name: "Dheya Career Mentors" }],
  creator: "Dheya Career Mentors",
  publisher: "Dheya Career Mentors",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dheya.com"),
  openGraph: {
    title: "Dheya Career Mentors | Transform Your Career Journey",
    description:
      "India's premier career mentoring platform helping professionals discover career clarity and fulfillment.",
    type: "website",
    locale: "en_IN",
    siteName: "Dheya Career Mentors",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dheya Career Mentors",
    description:
      "Transform your career journey with India's premier career mentoring platform.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when available
    // google: "google-site-verification-code",
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
        className={`${oswald.variable} ${lora.variable} font-sans antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
