"use client"

import { useState } from "react"
import { Sun, PartyPopper, Mountain, Heart, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"

const moods = [
  {
    id: "peaceful",
    label: "Peaceful & Relaxing",
    icon: Sun,
    emoji: "🌴",
    color: "from-[oklch(0.7_0.15_230)] to-[oklch(0.75_0.12_240)]",
    glow: "oklch(0.7_0.15_230/0.4)",
    description: "Beach days, quiet mornings, scenic views",
  },
  {
    id: "festive",
    label: "Fun & Exciting",
    icon: PartyPopper,
    emoji: "🎢",
    color: "from-[oklch(0.72_0.16_25)] to-[oklch(0.7_0.15_35)]",
    glow: "oklch(0.72_0.16_25/0.4)",
    description: "Theme parks, festivals, family activities",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    icon: Mountain,
    emoji: "🏕️",
    color: "from-[oklch(0.7_0.15_150)] to-[oklch(0.65_0.12_160)]",
    glow: "oklch(0.7_0.15_150/0.4)",
    description: "Hiking, camping, outdoor exploration",
  },
  {
    id: "cultural",
    label: "Cultural Discovery",
    icon: Heart,
    emoji: "🏛️",
    color: "from-[oklch(0.75_0.12_290)] to-[oklch(0.7_0.1_280)]",
    glow: "oklch(0.75_0.12_290/0.4)",
    description: "Museums, historic sites, local traditions",
  },
  {
    id: "wellness",
    label: "Rest & Recharge",
    icon: Flower2,
    emoji: "🌺",
    color: "from-[oklch(0.8_0.14_340)] to-[oklch(0.75_0.12_350)]",
    glow: "oklch(0.8_0.14_340/0.4)",
    description: "Spa resorts, nature retreats, slow travel",
  },
]

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  return (
    <section id="mood-selector" className="relative z-10 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-foreground">
            What kind of trip are you dreaming of?
          </h2>
          <p className="text-lg text-foreground/60">Select a mood to personalize your family adventure</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon
            const isSelected = selectedMood === mood.id

            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300",
                  "bg-white/80 backdrop-blur-sm border border-border/50 hover:scale-105 hover:shadow-lg",
                  isSelected && "ring-2 ring-primary scale-105 shadow-lg",
                )}
                style={{
                  boxShadow: isSelected ? `0 4px 24px ${mood.glow}` : undefined,
                }}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all",
                    "bg-gradient-to-br",
                    mood.color,
                    "group-hover:shadow-lg",
                  )}
                  style={{
                    boxShadow: isSelected ? `0 4px 16px ${mood.glow}` : undefined,
                  }}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm text-center mb-2">{mood.label}</h3>
                <p className="text-xs text-foreground/50 text-center hidden sm:block">{mood.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
