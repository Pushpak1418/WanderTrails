import { NextResponse } from "next/server"
import { generateBudgetEstimate } from "@/lib/gemini"
import { inferLocalCurrency, type CurrencyChoice } from "@/lib/currency"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const destination = String(body.destination ?? "").trim()
    const start = typeof body.start === "string" ? body.start : undefined
    const end = typeof body.end === "string" ? body.end : undefined
    const currencyChoice = (body.currency as CurrencyChoice | undefined) ?? "usd"

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 })
    }

    const localCurrency = inferLocalCurrency(destination)
    const currencyCode =
      currencyChoice === "usd" ? "USD" : currencyChoice === "inr" ? "INR" : localCurrency.code

    const estimate = await generateBudgetEstimate({ destination, start, end, currencyCode })

    return NextResponse.json({ estimate })
  } catch (error) {
    console.error("[Gemini budget] Error:", error)
    return NextResponse.json({ error: "Failed to generate budget estimate" }, { status: 500 })
  }
}
