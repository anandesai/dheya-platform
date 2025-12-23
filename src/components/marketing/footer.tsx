import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react"

const footerNavigation = {
  programs: [
    { name: "Early Career", href: "/programs/early-career" },
    { name: "Mid-Career", href: "/programs/mid-career" },
    { name: "Senior", href: "/programs/senior" },
    { name: "Returning Women", href: "/programs/returning-women" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Mentors", href: "/mentors" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Blog", href: "/blog" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  social: [
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="bg-forest-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cream-100 rounded-full flex items-center justify-center">
                <span className="text-forest-800 font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-cream-100">
                Dheya Career Mentors
              </span>
            </Link>
            <p className="mt-4 text-sm text-cream-200 max-w-md">
              India&apos;s premier career mentoring platform. Helping
              professionals discover clarity, purpose, and fulfillment in their
              careers for over 18 years.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-cream-200">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@dheya.com" className="hover:text-cream-100">
                  hello@dheya.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-cream-200">
                <Phone className="h-4 w-4" />
                <a href="tel:+919876543210" className="hover:text-cream-100">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-cream-200">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold text-cream-100 uppercase tracking-wider">
              Programs
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.programs.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-200 hover:text-cream-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-cream-100 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-200 hover:text-cream-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-cream-100 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-200 hover:text-cream-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-forest-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-cream-200">
              &copy; {new Date().getFullYear()} Dheya Career Mentors. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream-200 hover:text-cream-100 transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-forest-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gold-400">18+</div>
              <div className="text-xs text-cream-200 mt-1">Years of Excellence</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">100K+</div>
              <div className="text-xs text-cream-200 mt-1">Professionals Mentored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">91%</div>
              <div className="text-xs text-cream-200 mt-1">Clarity Achievement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400">4.9/5</div>
              <div className="text-xs text-cream-200 mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
