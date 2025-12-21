"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialMessages = [
  {
    role: "assistant" as const,
    content: "Hi there! I'm here to help plan your perfect family trip. Where would you like to go?",
  },
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    const userMessage = input
    setMessages((prev) => [...prev, { role: "user" as const, content: userMessage }])
    setInput("")
    setIsSending(true)

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, { role: "user" as const, content: userMessage }] }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI reply")
      }

      const data = await response.json()
      const reply = data.reply || "I had trouble answering that. Please try again."

      setMessages((prev) => [...prev, { role: "assistant" as const, content: reply }])
    } catch (error) {
      console.error("AIChatbot error", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "I ran into a problem talking to the AI. Please check your Gemini API key and try again.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-br from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)]",
          "flex items-center justify-center",
          "shadow-[0_4px_20px_oklch(0.65_0.18_250/0.3)]",
          "hover:shadow-[0_4px_30px_oklch(0.65_0.18_250/0.5)] hover:scale-110",
          "transition-all duration-300",
          isOpen && "scale-0 opacity-0",
        )}
        title="Ask Wandertrails AI"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Panel - Updated for light theme */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]",
          "transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="bg-white/95 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Wandertrails AI</h3>
                <p className="text-xs text-white/70">Your travel companion</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-[oklch(0.88_0.08_80)] to-[oklch(0.84_0.08_320)] text-white rounded-br-md"
                      : "bg-white border border-border/50 text-foreground rounded-bl-md shadow-sm",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-[oklch(0.88_0.08_80)] to-[oklch(0.84_0.08_320)] text-white hover:opacity-95 disabled:opacity-60"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
