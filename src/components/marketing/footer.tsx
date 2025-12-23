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
    <footer className="bg-cream-100 border-t border-cream-200">
      {/* Main Footer Content */}
      <div className="container-uplift py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-charcoal-800 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <span className="text-cream-50 font-display font-bold text-lg">D</span>
              </div>
              <span className="font-display font-bold text-xl text-charcoal-800">
                Dheya Career Mentors
              </span>
            </Link>
            <p className="mt-4 font-body text-charcoal-600 max-w-md leading-relaxed">
              India&apos;s premier career mentoring platform. Helping
              professionals discover clarity, purpose, and fulfillment in their
              careers for over 18 years.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-charcoal-600">
                <Mail className="h-4 w-4 text-purple-500" />
                <a href="mailto:hello@dheya.com" className="font-body hover:text-purple-600 transition-colors">
                  hello@dheya.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-charcoal-600">
                <Phone className="h-4 w-4 text-purple-500" />
                <a href="tel:+919876543210" className="font-body hover:text-purple-600 transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-charcoal-600">
                <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                <span className="font-body">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-micro text-charcoal-800 mb-4">
              Programs
            </h3>
            <ul className="space-y-3">
              {footerNavigation.programs.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-charcoal-600 hover:text-purple-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-micro text-charcoal-800 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-charcoal-600 hover:text-purple-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-micro text-charcoal-800 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-charcoal-600 hover:text-purple-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-10 border-t border-cream-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl font-bold text-purple-500">18+</div>
              <div className="text-micro text-charcoal-500 mt-1">Years of Excellence</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-purple-500">100K+</div>
              <div className="text-micro text-charcoal-500 mt-1">Professionals Mentored</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-purple-500">91%</div>
              <div className="text-micro text-charcoal-500 mt-1">Clarity Achievement</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-purple-500">4.9/5</div>
              <div className="text-micro text-charcoal-500 mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-charcoal-800">
        <div className="container-uplift py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-body text-sm text-cream-200">
              &copy; {new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
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
                    className="w-9 h-9 rounded-full bg-charcoal-700 flex items-center justify-center text-cream-200 hover:bg-purple-500 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
