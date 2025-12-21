"use client"

import { useEffect, useState } from "react"
import { Plane, Train, Bus, BedDouble, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CurrencyChoice } from "@/lib/currency"

interface BestPriceFinderProps {
  destination: string | null
  start?: string | null
  end?: string | null
  currency?: CurrencyChoice
  /** Human-friendly label like "USD", "INR" or "Local (CHF)" for display only. */
  currencyLabel?: string
}

interface BestPricePlatform {
  platformName: string
  platformId: string | null
  displayName: string | null
  redirectUrl: string | null
}

interface BestPriceOption {
  optionType: "flight" | "train" | "bus" | "hotel"
  title: string
  description: string
  estimatedCostRange: string
  duration?: string
  recommendedPlatforms: BestPricePlatform[]
}

interface ApiResponse {
  options: BestPriceOption[]
  disclaimer?: string
  error?: string
}

export function BestPriceFinder({ destination, start, end, currency = "usd", currencyLabel }: BestPriceFinderProps) {
  const [options, setOptions] = useState<BestPriceOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disclaimer, setDisclaimer] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!destination) return

    const controller = new AbortController()

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      setOptions([])
      setDisclaimer(undefined)
      try {
        const response = await fetch("/api/best-price-finder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination,
            start: start ?? undefined,
            end: end ?? undefined,
            currency,
          }),
          signal: controller.signal,
        })

        const payload: ApiResponse | { error?: string } = await response.json().catch(() => ({ error: undefined }))

        if (!response.ok) {
          const message =
            (payload as any)?.error || `We couldn't fetch AI suggestions right now (status ${response.status}).`
          setError(message)
          setOptions([])
          return
        }

        if ("error" in payload && payload.error) {
          setError(payload.error)
          setOptions([])
          return
        }

        const data = payload as ApiResponse
        setOptions(data.options ?? [])
        setDisclaimer(data.disclaimer)

        setOptions(data.options ?? [])
        setDisclaimer(data.disclaimer)
      } catch (err: any) {
        if (err.name === "AbortError") return
        console.error("BestPriceFinder error", err)
        setError("We couldn\'t fetch AI suggestions right now. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [destination, start, end])

  const getIcon = (type: BestPriceOption["optionType"]) => {
    switch (type) {
      case "flight":
        return Plane
      case "train":
        return Train
      case "bus":
        return Bus
      case "hotel":
        return BedDouble
      default:
        return Plane
    }
  }

  if (!destination) {
    return null
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Best price suggestions</h2>
          <p className="text-xs text-foreground/60 mt-1">
            Smart ideas for how to travel and where to stay. Click through to book on your favorite platform.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center text-[11px] text-foreground/50">
            <span>Showing prices in&nbsp;</span>
            <span className="font-semibold uppercase">{(currencyLabel || currency).toString()}</span>
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
              <div className="w-3.5 h-3.5 border-2 border-foreground/20 border-t-foreground/70 rounded-full animate-spin" />
              <span>Searching…</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="space-y-3">
        {isLoading && (
          <div className="rounded-2xl border border-border/60 bg-muted/60 px-4 py-4 flex items-center gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[oklch(0.78_0.08_50/0.4)] animate-spin" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[oklch(0.88_0.08_80)] to-[oklch(0.84_0.08_320)] flex items-center justify-center text-white shadow-lg">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-foreground/70">
              <p className="font-semibold">Asking Gemini for the best routes & stays…</p>
              <p className="text-[11px] sm:text-xs text-foreground/60">
                Hang tight while we search flights, trains, buses and hotels for smart options.
              </p>
            </div>
          </div>
        )}

        {options.length === 0 && !isLoading && !error && (
          <p className="text-xs text-foreground/60">
            No AI suggestions yet for this search. Try adjusting your dates or destination.
          </p>
        )}

        {options.map((option, index) => {
          const Icon = getIcon(option.optionType)
          return (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-muted/40 p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.88_0.08_80)] to-[oklch(0.84_0.08_320)] text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{option.title}</p>
                    <p className="text-xs text-foreground/60 mt-0.5">{option.description}</p>
                    {option.duration && (
                      <p className="text-[11px] text-foreground/50 mt-0.5">Duration: {option.duration}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-foreground">
                  {option.estimatedCostRange}
                </div>
              </div>

              {option.recommendedPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {option.recommendedPlatforms.map((platform, pIndex) => (
                    <Button
                      key={pIndex}
                      asChild
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 rounded-full border-border/50 text-xs px-3",
                        platform.redirectUrl &&
                          "bg-gradient-to-r from-[oklch(0.88_0.08_80/0.07)] to-[oklch(0.84_0.08_320/0.07)]",
                      )}
                    >
                      <a
                        href={platform.redirectUrl || "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <span>{platform.displayName ?? platform.platformName}</span>
                        <ExternalLink className="inline-block w-3 h-3 ml-1 align-text-top" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-foreground/60 border-t border-border/30 pt-3 mt-1">
        Prices are estimated. Final prices may vary on booking platforms.
      </p>
    </div>
  )
}
