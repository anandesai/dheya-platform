"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const programs = [
  {
    name: "Early Career",
    description: "Build an unfair advantage in your 20s",
    href: "/programs/early-career",
    badge: "Ages 22-30",
  },
  {
    name: "Mid-Career",
    description: "Break free from the BBD trap",
    href: "/programs/mid-career",
    badge: "Ages 30-45",
  },
  {
    name: "Senior Leaders",
    description: "Design your legacy, not just retirement",
    href: "/programs/senior",
    badge: "Ages 45+",
  },
  {
    name: "Returning Women",
    description: "Your comeback story starts here",
    href: "/programs/returning-women",
    badge: "Career Re-entry",
  },
]

const navigation = [
  { name: "Our Story", href: "/about" },
  { name: "Why We Exist", href: "/manifesto" },
  { name: "Proof It Works", href: "/success-stories" },
  { name: "Meet Mentors", href: "/mentors" },
  { name: "Let's Talk", href: "/contact" },
]

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDF8F0]/90 backdrop-blur-md border-b border-charcoal-900/5 transition-all duration-300">
      <nav className="container-uplift flex items-center justify-between py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-4xl text-charcoal-900 tracking-tighter uppercase">u.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-purple-600 transition-colors",
                  pathname.startsWith("/programs")
                    ? "text-purple-600"
                    : "text-charcoal-900"
                )}
              >
                Programs
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[600px] bg-[#FDF8F0] border border-charcoal-900/10 shadow-2xl rounded-xl p-6 mt-4 grid grid-cols-2 gap-4">
              {programs.map((program) => (
                <DropdownMenuItem key={program.href} asChild className="focus:bg-purple-50 rounded-lg cursor-pointer p-4 group">
                  <Link
                    href={program.href}
                    className="flex flex-col items-start gap-2"
                  >
                    <span className="inline-block text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {program.badge}
                    </span>
                    <span className="font-headline font-bold text-lg text-charcoal-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">
                      {program.name}
                    </span>
                    <span className="font-body text-sm text-charcoal-600 leading-relaxed">
                      {program.description}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "font-display text-xs font-bold uppercase tracking-widest hover:text-purple-600 transition-colors",
                pathname === item.href
                  ? "text-purple-600"
                  : "text-charcoal-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth/login" className="font-headline text-xs font-bold uppercase tracking-widest text-charcoal-900 hover:text-purple-600">
            Sign In
          </Link>
          <Button asChild className="rounded-full bg-purple-500 hover:bg-purple-600 text-white font-headline font-bold uppercase tracking-wider text-xs px-6 py-5 shadow-lg hover:shadow-xl transition-all">
            <Link href="/auth/register">Start Free →</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-charcoal-900"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FDF8F0] lg:hidden animate-in slide-in-from-right">
          <div className="container-uplift py-5">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-display font-bold text-4xl text-charcoal-900 tracking-tighter uppercase">u.</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-charcoal-900"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="font-display text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-4">Programs</p>
                {programs.map((program) => (
                  <Link
                    key={program.href}
                    href={program.href}
                    className="block font-display text-2xl font-bold text-charcoal-900 uppercase tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {program.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-4">
                <p className="font-display text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-4">Menu</p>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block font-display text-2xl font-bold text-charcoal-900 uppercase tracking-tight"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="pt-8 space-y-4">
                <Button asChild className="w-full rounded-full bg-purple-500 hover:bg-purple-600 text-white font-headline font-bold uppercase tracking-wider text-sm py-6 shadow-lg">
                  <Link href="/auth/register">Start Your Transformation →</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full font-headline font-bold uppercase tracking-wider text-sm text-charcoal-900">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
