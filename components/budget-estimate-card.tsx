"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CurrencyChoice } from "@/lib/currency"

interface BudgetEstimateCardProps {
  destination: string | null
  start?: string | null
  end?: string | null
  currency?: CurrencyChoice
  /** Human-friendly label like "USD", "INR" or "Local (CHF)" for display only. */
  currencyLabel?: string
}

export function BudgetEstimateCard({
  destination,
  start,
  end,
  currency = "usd",
  currencyLabel,
}: BudgetEstimateCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [estimate, setEstimate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    const trimmedDestination = destination?.trim()
    if (!trimmedDestination) {
      setError("Please provide a destination first.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/gemini/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination: trimmedDestination, start, end, currency }),
      })

      if (!response.ok) {
        throw new Error("Failed to get budget estimate")
      }

      const data = await response.json()
      setEstimate(data.estimate || "I couldn’t generate a budget estimate right now. Please try again.")
    } catch (err) {
      console.error("Budget estimate error", err)
      setError("There was a problem talking to the AI. Please check your Gemini API key and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] rounded-2xl text-white p-5 sm:p-6 shadow-lg flex flex-col gap-3">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Destination insights</h2>
        </div>
        <span className="text-[11px] text-white/80 uppercase tracking-wide">
          Prices / tips in {(currencyLabel || currency.toUpperCase()).toString()}
        </span>
      </div>
      <p className="text-sm text-white/80">
        Get an AI snapshot of todays weather, whats happening, and how to make the most of your trip.
      </p>

      {estimate ? (
        <InsightsSections text={estimate} />
      ) : (
        <div className="rounded-xl bg-black/15 border border-white/15 px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-wide text-white/70 mb-1">No insights yet</p>
          <p className="text-xs text-white/80">
            Click the button below to ask Gemini for a quick snapshot of this destination.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-100">{error}</p>}

      <Button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/95 text-[oklch(0.78_0.08_50)] font-semibold hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Asking Gemini..." : "Get AI suggestions"}
      </Button>

      <p className="text-[11px] leading-relaxed text-white/70">
        This calls your backend at <code className="px-1 py-0.5 bg-black/30 rounded">/api/gemini/budget</code>, which in
        turn uses your <code className="px-1 py-0.5 bg-black/30 rounded">GEMINI_API_KEY</code>.
      </p>
    </div>
  )
}

interface InsightsSectionsProps {
  text: string
}

function InsightsSections({ text }: InsightsSectionsProps) {
  const sections = splitInsights(text)

  if (!sections) {
    return (
      <div className="rounded-xl bg-black/15 border border-white/15 px-4 py-3 text-sm whitespace-pre-wrap">
        {text}
      </div>
    )
  }

  const { weather, happenings, suggestions } = sections

  const renderParagraphOrList = (value: string) => {
    const lines = value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    const bullets = lines.filter((l) => l.startsWith("-") || l.startsWith("•"))

    if (bullets.length > 0) {
      return (
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
          {lines.map((l, idx) => (
            <li key={idx}>{l.replace(/^[-•]\s*/, "")}</li>
          ))}
        </ul>
      )
    }

    return <p className="text-xs sm:text-sm whitespace-pre-wrap">{value}</p>
  }

  return (
    <div className="space-y-3 text-sm">
      {weather && (
        <div className="rounded-xl bg-black/15 border border-white/15 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70 mb-1">
            Current weather snapshot
          </p>
          {renderParagraphOrList(weather)}
        </div>
      )}
      {happenings && (
        <div className="rounded-xl bg-black/15 border border-white/15 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70 mb-1">
            Whats happening there
          </p>
          {renderParagraphOrList(happenings)}
        </div>
      )}
      {suggestions && (
        <div className="rounded-xl bg-black/15 border border-white/15 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70 mb-1">
            Suggestions for your trip
          </p>
          {renderParagraphOrList(suggestions)}
        </div>
      )}
    </div>
  )
}

function splitInsights(text: string):
  | { weather: string; happenings: string; suggestions: string }
  | null {
  const weatherMatch = text.match(
    /\*\*Current weather snapshot\*\*([\s\S]*?)(?=\*\*What[’'`]s happening|\*\*Whats happening|\*\*What is happening|\*\*Suggestions for your trip|$)/i,
  )
  const happeningsMatch = text.match(
    /\*\*What[’'`]s happening[\s\S]*?\*\*([\s\S]*?)(?=\*\*Suggestions for your trip|$)/i,
  )
  const suggestionsMatch = text.match(/\*\*Suggestions for your trip\*\*([\s\S]*)/i)

  if (!weatherMatch && !happeningsMatch && !suggestionsMatch) {
    return null
  }

  return {
    weather: (weatherMatch?.[1] || "").trim(),
    happenings: (happeningsMatch?.[1] || "").trim(),
    suggestions: (suggestionsMatch?.[1] || "").trim(),
  }
}
