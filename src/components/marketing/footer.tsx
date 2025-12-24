import Link from "next/link"
import { Linkedin, Twitter, Instagram } from "lucide-react"

const footerNavigation = {
  programs: [
    { name: "Early Career", href: "/programs/early-career" },
    { name: "Mid-Career", href: "/programs/mid-career" },
    { name: "Senior", href: "/programs/senior" },
    { name: "Returning Women", href: "/programs/returning-women" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Philosophy", href: "/philosophy" },
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
    <footer className="bg-[#FDF8F0] border-t border-charcoal-900/10 text-charcoal-900 pt-20 pb-12">
      <div className="container-uplift">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="block">
              <span className="font-display font-bold text-6xl text-charcoal-900 tracking-tighter uppercase leading-none">
                UPLIFT <br /> FOUNDERS
              </span>
            </Link>
            <p className="font-body text-lg text-charcoal-600 max-w-sm leading-relaxed">
              Helping founders to GROW through uncertainty & MAXIMIZE their impact.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-charcoal-900 flex items-center justify-center hover:bg-charcoal-900 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-charcoal-900 flex items-center justify-center hover:bg-charcoal-900 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-charcoal-900 flex items-center justify-center hover:bg-charcoal-900 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-display font-bold text-charcoal-400 uppercase tracking-widest mb-6">
              Programs
            </h3>
            <ul className="space-y-3">
              {footerNavigation.programs.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-display text-sm font-bold text-charcoal-900 hover:text-purple-600 transition-colors uppercase tracking-wide block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-display font-bold text-charcoal-400 uppercase tracking-widest mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-display text-sm font-bold text-charcoal-900 hover:text-purple-600 transition-colors uppercase tracking-wide block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-display font-bold text-charcoal-400 uppercase tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-display text-sm font-bold text-charcoal-900 hover:text-purple-600 transition-colors uppercase tracking-wide block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-900/10 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="font-display text-xs font-bold text-charcoal-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-display text-xs font-bold text-charcoal-400 uppercase tracking-widest">Privacy Policy</span>
              <span className="font-display text-xs font-bold text-charcoal-400 uppercase tracking-widest">Terms of Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
