import { NextResponse } from "next/server"
import { generateChatReply } from "@/lib/gemini"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const history = (body?.messages ?? []) as { role: "user" | "assistant"; content: string }[]

    const reply = await generateChatReply(history)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[Gemini chat] Error:", error)
    return NextResponse.json({ error: "Failed to generate chat reply" }, { status: 500 })
  }
}
