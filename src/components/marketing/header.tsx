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
    description: "For professionals aged 22-30",
    href: "/programs/early-career",
  },
  {
    name: "Mid-Career",
    description: "For professionals aged 30-45",
    href: "/programs/mid-career",
  },
  {
    name: "Senior",
    description: "For professionals aged 45+",
    href: "/programs/senior",
  },
  {
    name: "Returning Women",
    description: "Career re-entry support",
    href: "/programs/returning-women",
  },
]

const navigation = [
  { name: "About", href: "/about" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "Mentors", href: "/mentors" },
  { name: "Contact", href: "/contact" },
]

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-cream-50/95 backdrop-blur-md border-b border-cream-200/50">
      <nav className="container-uplift flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-charcoal-800 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
            <span className="text-cream-50 font-display font-bold text-lg">D</span>
          </div>
          <span className="font-display font-bold text-xl text-charcoal-800 hidden sm:block">
            Dheya
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {/* Programs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 font-display text-sm font-medium",
                  pathname.startsWith("/programs")
                    ? "text-charcoal-900"
                    : "text-charcoal-600 hover:text-charcoal-900"
                )}
              >
                Programs
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-white border-cream-200">
              {programs.map((program) => (
                <DropdownMenuItem key={program.href} asChild>
                  <Link
                    href={program.href}
                    className="flex flex-col items-start gap-1 p-3 hover:bg-cream-50"
                  >
                    <span className="font-display font-semibold text-charcoal-800">
                      {program.name}
                    </span>
                    <span className="font-body text-xs text-charcoal-500">
                      {program.description}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Other Navigation Links */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "font-display text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-charcoal-900"
                  : "text-charcoal-600 hover:text-charcoal-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button asChild variant="ghost" className="font-display text-charcoal-700 hover:text-charcoal-900">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="uplift" size="default">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-charcoal-800 hover:bg-cream-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50">
          <div className="space-y-1 px-4 py-6">
            {/* Programs Section */}
            <div className="space-y-2">
              <p className="text-micro text-charcoal-500 px-3">
                Programs
              </p>
              {programs.map((program) => (
                <Link
                  key={program.href}
                  href={program.href}
                  className="block rounded-lg px-3 py-2.5 font-display text-sm font-medium text-charcoal-800 hover:bg-cream-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {program.name}
                </Link>
              ))}
            </div>

            <div className="my-4 border-t border-cream-200" />

            {/* Other Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 font-display text-sm font-medium text-charcoal-800 hover:bg-cream-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="my-4 border-t border-cream-200" />

            {/* Mobile CTA */}
            <div className="space-y-3 px-3 pt-2">
              <Button asChild variant="upliftOutline" className="w-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="uplift" className="w-full">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
