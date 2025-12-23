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
    <header className="sticky top-0 z-50 w-full border-b border-cream-300 bg-cream-100/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-forest-800 rounded-full flex items-center justify-center">
            <span className="text-cream-100 font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-xl text-forest-800 hidden sm:block">
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
                  "flex items-center gap-1 text-sm font-medium",
                  pathname.startsWith("/programs")
                    ? "text-forest-800"
                    : "text-muted-foreground hover:text-forest-800"
                )}
              >
                Programs
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {programs.map((program) => (
                <DropdownMenuItem key={program.href} asChild>
                  <Link
                    href={program.href}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <span className="font-medium text-forest-800">
                      {program.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
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
                "text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-forest-800"
                  : "text-muted-foreground hover:text-forest-800"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-forest-800"
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
        <div className="lg:hidden border-t border-cream-300 bg-cream-100">
          <div className="space-y-1 px-4 py-4">
            {/* Programs Section */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
                Programs
              </p>
              {programs.map((program) => (
                <Link
                  key={program.href}
                  href={program.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-forest-800 hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {program.name}
                </Link>
              ))}
            </div>

            <div className="my-4 border-t border-cream-300" />

            {/* Other Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-forest-800 hover:bg-cream-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="my-4 border-t border-cream-300" />

            {/* Mobile CTA */}
            <div className="space-y-2 px-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
