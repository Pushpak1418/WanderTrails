"use client"

import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative z-10 pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-sm border border-border/50 mb-8">
          <Sparkles className="w-4 h-4 text-[oklch(0.78_0.08_50)]" />
          <span className="text-sm text-foreground/80 font-medium">AI-Powered Family Trip Planner</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance">
          <span className="bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] bg-clip-text text-transparent">
            Plan Your Perfect
          </span>
          <br />
          <span className="text-foreground">Family Adventure</span>
        </h1>

        <p className="text-xl sm:text-2xl text-foreground/60 max-w-2xl mx-auto leading-relaxed text-pretty">
          Tell us your dream destination, and we&apos;ll craft the perfect itinerary for your family.
        </p>

        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] blur-xl opacity-40 animate-glow-pulse" />
            <a
              href="#mood-selector"
              className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white font-semibold rounded-full hover:shadow-[0_4px_30px_oklch(0.86_0.09_50/0.45)] transition-all"
            >
              Start Planning
              <Sparkles className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
