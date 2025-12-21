import { NextResponse } from "next/server"
import { generateItinerary } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const destination = String(body.destination ?? "").trim()
    const durationDays = Number(body.durationDays ?? 0)
    const needs = (body.needs ?? []) as string[]
    const notes = typeof body.notes === "string" ? body.notes : undefined

    if (!destination || !durationDays) {
      return NextResponse.json({ error: "Destination and duration are required" }, { status: 400 })
    }

    const itinerary = await generateItinerary({ destination, durationDays, needs, notes })

    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error("[Gemini itinerary] Error:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
