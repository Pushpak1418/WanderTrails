"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Menu, X, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const destinations = {
  cities: ["Paris", "London", "Dubai", "Tokyo", "Bali", "New York"],
  places: ["Beaches", "Mountains", "Cities", "Honeymoon Spots"],
}

const accommodations = ["Hotels", "Resorts", "Villas", "Hostels", "Boutique Stays"]
const travelOptions = ["Flights", "Trains", "Buses", "Cruises", "Road Trips"]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const { user, isLoading, logout } = useAuth()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="glassmorphism rounded-2xl px-6 py-4">
        {/* Main navbar row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <svg viewBox="0 0 32 32" className="w-8 h-8">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.88 0.08 80)" />
                    <stop offset="50%" stopColor="oklch(0.86 0.09 50)" />
                    <stop offset="100%" stopColor="oklch(0.84 0.08 320)" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12c1.5 0 2.94-.275 4.266-.777C14.5 25.5 10 20 10 16c0-6.627 5.373-12 12-12-1.326-.502-2.766-.777-4.266-.777-.578 0-1.148.038-1.71.11"
                  fill="url(#logo-gradient)"
                />
                <path
                  d="M22 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 2c3.314 0 6 2.686 6 6s-2.686 6-6 6"
                  fill="url(#logo-gradient)"
                  opacity="0.6"
                />
                <circle cx="24" cy="14" r="1.5" fill="oklch(0.85 0.15 85)" />
              </svg>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] bg-clip-text text-transparent">
              Wandertrails
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Destinations <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glassmorphism border-border/50 min-w-[200px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Cities</div>
                {destinations.cities.map((city) => (
                  <DropdownMenuItem key={city} className="cursor-pointer hover:bg-primary/10">
                    {city}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Places</div>
                {destinations.places.map((place) => (
                  <DropdownMenuItem key={place} className="cursor-pointer hover:bg-primary/10">
                    {place}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Accommodations <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glassmorphism border-border/50">
                {accommodations.map((item) => (
                  <DropdownMenuItem key={item} className="cursor-pointer hover:bg-primary/10">
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Travel Options <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glassmorphism border-border/50">
                {travelOptions.map((item) => (
                  <DropdownMenuItem key={item} className="cursor-pointer hover:bg-primary/10">
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/planner"
              className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Itinerary Planner
            </Link>
          </div>

          {/* CTA Button - Updated gradient */}
          <div className="flex items-center gap-4">
            {/* Auth Links */}
            {!isLoading && (
              <div className="hidden sm:flex items-center gap-3">
                {user ? (
                  <>
                    <Link
                      href="/journeys"
                      className="px-3 py-2 text-foreground/70 hover:text-foreground transition-colors font-medium"
                    >
                      My Journeys
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-foreground/70 hover:text-foreground"
                    >
                      {isLoggingOut ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-foreground/20 border-t-foreground/70 rounded-full animate-spin" />
                          Leaving...
                        </span>
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white font-semibold hover:opacity-95 transition-all hover:shadow-[0_4px_20px_oklch(0.86_0.09_50/0.4)] border-0"
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white font-semibold hover:opacity-95 transition-all hover:shadow-[0_4px_20px_oklch(0.86_0.09_50/0.45)] border-0"
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-border/30">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <a href="#" className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium">
                Destinations
              </a>
              <a href="#" className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium">
                Accommodations
              </a>
              <a href="#" className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium">
                Travel Options
              </a>
              <Link
                href="/planner"
                className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Itinerary Planner
              </Link>
              <Button
                asChild
                className="mt-2 bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white font-semibold"
              >
                <Link href="/planner" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Plan Your Trip
                </Link>
              </Button>

              {!isLoading && (
                <div className="mt-3 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link
                        href="/journeys"
                        className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Journeys
                      </Link>
                      <Button
                        variant="outline"
                        onClick={async () => {
                          await handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        disabled={isLoggingOut}
                        className="border-border/50"
                      >
                        {isLoggingOut ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-foreground/20 border-t-foreground/70 rounded-full animate-spin" />
                            Leaving...
                          </span>
                        ) : (
                          "Logout"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[oklch(0.65_0.18_250)] via-[oklch(0.7_0.15_230)] to-[oklch(0.72_0.16_25)] text-white font-semibold"
                      >
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
