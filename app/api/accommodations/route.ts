import { NextResponse } from "next/server"
import { generateAccommodationOptions, generateBestPriceFinderSuggestions } from "../../../lib/gemini"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { optionType, destination, currency } = body

    if (!optionType || !destination) {
      return NextResponse.json({ error: "Missing optionType or destination" }, { status: 400 })
    }

    if (optionType === "hotel") {
      // Reuse the Best Price Finder for hotel-focused results when possible
      const result = await generateBestPriceFinderSuggestions({ destination, currency })
      // map to a common shape
      const hotels = result.options
        .filter((o) => o.optionType === "hotel")
        .map((o) => ({
          optionType: o.optionType,
          title: o.title,
          description: o.description,
          estimatedCostRange: o.estimatedCostRange,
          recommendedPlatforms: o.recommendedPlatforms.map((p) => ({ platformName: p.platformName, bookingUrl: platformToUrl(p.platformId, p.platformName) })),
        }))

      return NextResponse.json({ options: hotels })
    }

    const ai = await generateAccommodationOptions({ optionType, destination, currency })
    return NextResponse.json(ai)
  } catch (error) {
    console.error("/api/accommodations error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function platformToUrl(platformId?: string, fallbackName?: string) {
  const map: Record<string, string> = {
    makemytrip: "https://www.makemytrip.com/",
    skyscanner: "https://www.skyscanner.com/",
    booking: "https://www.booking.com/",
    agoda: "https://www.agoda.com/",
    irctc: "https://www.irctc.co.in/",
    expedia: "https://www.expedia.com/",
    hotels: "https://www.hotels.com/",
    airbnb: "https://www.airbnb.com/",
    vrbo: "https://www.vrbo.com/",
  }

  if (platformId && map[platformId]) return map[platformId]
  if (fallbackName) {
    const key = fallbackName.toLowerCase()
    if (key.includes("booking")) return map["booking"]
    if (key.includes("agoda")) return map["agoda"]
    if (key.includes("airbnb")) return map["airbnb"]
    if (key.includes("expedia")) return map["expedia"]
  }

  return "https://www.google.com/search?q=book+accommodation"
}
