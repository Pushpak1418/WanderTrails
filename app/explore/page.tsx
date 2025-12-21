"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { BudgetEstimateCard } from "@/components/budget-estimate-card"
import { BestPriceFinder } from "@/components/best-price-finder"
import { CalendarRange, MapPin } from "lucide-react"
import { getBaseCurrencyInfo, type CurrencyChoice } from "@/lib/currency"
import { useAuth } from "@/components/auth/auth-provider"

const destinationLabels: Record<string, string> = {
  paris: "Paris, France",
  bali: "Bali, Indonesia",
  tokyo: "Tokyo, Japan",
  dubai: "Dubai, UAE",
  orlando: "Orlando, USA",
  london: "London, UK",
  maldives: "Maldives",
  "swiss-alps": "Swiss Alps",
  santorini: "Santorini, Greece",
  cancun: "Cancun, Mexico",
}

export default function ExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()

  const destination = searchParams.get("destination") || undefined
  const start = searchParams.get("start") || undefined
  const end = searchParams.get("end") || undefined
  const currencyParam = (searchParams.get("currency") as CurrencyChoice | null) || "usd"

  const destinationLabel = destination ? destinationLabels[destination] ?? destination : "Your destination"
  const { selected: selectedCurrency, usd, inr, local } = getBaseCurrencyInfo(currencyParam, destinationLabel)

  const currencyDisplayLabel =
    currencyParam === "usd"
      ? usd.code
      : currencyParam === "inr"
        ? inr.code
        : local.code === "LOCAL"
          ? "Local"
          : `Local (${local.code})`

  const handleCurrencyChange = (choice: CurrencyChoice) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set("currency", choice)
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section className="relative z-10 pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Trip summary */}
          <div className="glassmorphism rounded-2xl px-5 sm:px-8 py-5 sm:py-6 border border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50 mb-1">
                Search results
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                Options for {destinationLabel}
              </h1>
              <p className="text-sm sm:text-base text-foreground/60 mt-2 max-w-xl">
                AI-generated ideas for how to travel and where to stay. You\'ll book safely on external
                platforms like MakeMyTrip, Skyscanner, Booking.com, etc.
              </p>
              {user && !isLoading && (
                <p className="text-xs sm:text-sm text-foreground/70 mt-2">
                  Welcome back, <span className="font-semibold">{user.name}</span> d here are personalized suggestions for your trip.
                </p>
              )}
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 text-xs sm:text-sm text-foreground/70">
              {destination && (
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[oklch(0.65_0.18_250)]" />
                  <span>{destinationLabel}</span>
                </div>
              )}
              {(start || end) && (
                <div className="inline-flex items-center gap-1.5">
                  <CalendarRange className="w-3.5 h-3.5 text-[oklch(0.65_0.18_250)]" />
                  <span>
                    {start || "Start"} – {end || "End"}
                  </span>
                </div>
              )}

              {/* Currency selector */}
              <div className="mt-1 inline-flex flex-col items-start sm:items-end gap-1">
                <span className="text-[10px] uppercase tracking-wide text-foreground/40">Prices in</span>
                <div className="inline-flex rounded-full bg-muted/60 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("usd")}
                    className={`px-2.5 py-1 rounded-full ${
                      currencyParam === "usd" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    {usd.code}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("local")}
                    className={`px-2.5 py-1 rounded-full ${
                      currencyParam === "local" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    {local.code === "LOCAL" ? "Local" : `Local (${local.code})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("inr")}
                    className={`px-2.5 py-1 rounded-full ${
                      currencyParam === "inr" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    {inr.code}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
            {/* Left: travel + hotels */}
            <div className="space-y-6">
              {user && !isLoading ? (
                <BestPriceFinder
                  destination={destination ?? null}
                  start={start ?? null}
                  end={end ?? null}
                  currency={currencyParam}
                  currencyLabel={currencyDisplayLabel}
                />
              ) : (
                <div className="rounded-2xl border border-border/50 bg-muted/40 p-5 sm:p-6 text-sm text-foreground/70">
                  <p className="text-sm font-semibold mb-2">Sign in to see AI price suggestions</p>
                  <p className="text-xs mb-3">
                    Create a free account or log in to unlock AI-powered travel options and live booking links for this search.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-foreground text-background hover:opacity-90"
                    >
                      Log in
                    </a>
                    <a
                      href="/signup"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white hover:opacity-95"
                    >
                      Sign up free
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right: AI insights card */}
            <div className="space-y-4">
              {user && !isLoading ? (
                <BudgetEstimateCard
                  destination={destinationLabel}
                  start={start ?? null}
                  end={end ?? null}
                  currency={currencyParam}
                  currencyLabel={currencyDisplayLabel}
                />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.88_0.08_80/0.3)] via-[oklch(0.86_0.09_50/0.3)] to-[oklch(0.84_0.08_320/0.3)] text-white p-5 sm:p-6 shadow-lg text-sm">
                  <p className="text-sm font-semibold mb-2">Create an account to unlock destination insights</p>
                  <p className="text-xs text-white/85 mb-3">
                    Sign up or log in to see AI-powered weather, trending highlights, and tips for {destinationLabel.toLowerCase()}.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-white/95 text-[oklch(0.78_0.08_50)] hover:bg-white"
                    >
                      Log in
                    </a>
                    <a
                      href="/signup"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-black/15 border border-white/40 hover:bg-black/10"
                    >
                      Sign up free
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
