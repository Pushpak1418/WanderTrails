import { NextResponse } from "next/server"

import { BOOKING_PLATFORMS, buildPlatformUrl, PlatformId } from "@/lib/booking-platforms"
import { BestPriceFinderInput, generateBestPriceFinderSuggestions } from "@/lib/gemini"
import { inferLocalCurrency, type CurrencyChoice } from "@/lib/currency"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BestPriceFinderInput> & { currency?: CurrencyChoice }

    const destination = String(body.destination ?? "").trim()
    const origin = typeof body.origin === "string" ? body.origin : undefined
    const start = typeof body.start === "string" ? body.start : undefined
    const end = typeof body.end === "string" ? body.end : undefined
    const budgetPreference = typeof body.budgetPreference === "string" ? body.budgetPreference : undefined
    const currencyChoice = (body.currency as CurrencyChoice | undefined) ?? "usd"

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 })
    }

    const localCurrency = inferLocalCurrency(destination)
    const currencyCode =
      currencyChoice === "usd" ? "USD" : currencyChoice === "inr" ? "INR" : localCurrency.code

    const aiResult = await generateBestPriceFinderSuggestions({
      origin,
      destination,
      start,
      end,
      budgetPreference,
      currency: currencyCode,
    })

    const optionsWithUrls = aiResult.options.map((option) => {
      const platforms = option.recommendedPlatforms.map((platform) => {
        const platformId = platform.platformId as PlatformId | undefined
        const config = platformId ? BOOKING_PLATFORMS[platformId] : undefined

        const url = platformId
          ? buildPlatformUrl({ platformId, destination, start, end })
          : undefined

        return {
          platformName: platform.platformName,
          platformId: platformId ?? null,
          displayName: config?.name ?? platform.platformName,
          redirectUrl: url ?? null,
        }
      })

      return {
        ...option,
        recommendedPlatforms: platforms,
      }
    })

    return NextResponse.json({
      options: optionsWithUrls,
      disclaimer:
        "Prices are estimated. Final prices may vary on external booking platforms.",
    })
  } catch (error) {
    console.error("[BestPriceFinder] Error:", error)
    return NextResponse.json({ error: "Failed to generate best price suggestions" }, { status: 500 })
  }
}
