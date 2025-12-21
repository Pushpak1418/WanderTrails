"use client"

import { useState } from "react"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const durations = [
  { value: "3", label: "A quick 3-day getaway" },
  { value: "5", label: "A fun 5-day break" },
  { value: "7", label: "A relaxed week" },
  { value: "10", label: "A memorable 10 days" },
  { value: "14", label: "An epic 2-week adventure" },
]

const destinations = [
  { value: "paris", label: "Paris, France" },
  { value: "bali", label: "Bali, Indonesia" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "orlando", label: "Orlando, USA" },
  { value: "london", label: "London, UK" },
  { value: "maldives", label: "Maldives" },
  { value: "swiss-alps", label: "Swiss Alps" },
  { value: "santorini", label: "Santorini, Greece" },
  { value: "cancun", label: "Cancun, Mexico" },
]

const needs = [
  { id: "kids", label: "Kid-friendly", emoji: "👶" },
  { id: "beaches", label: "Beach time", emoji: "🏖️" },
  { id: "nature", label: "Nature & outdoors", emoji: "🌲" },
  { id: "food", label: "Food exploration", emoji: "🍕" },
  { id: "culture", label: "Culture & history", emoji: "🏰" },
  { id: "adventure", label: "Adventure", emoji: "🎢" },
  { id: "relaxation", label: "Relaxation", emoji: "🧘" },
]

export function ItineraryForm() {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [duration, setDuration] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [itinerary, setItinerary] = useState<string | null>(null)

  const toggleNeed = (needId: string) => {
    setSelectedNeeds((prev) => (prev.includes(needId) ? prev.filter((id) => id !== needId) : [...prev, needId]))
  }

  const handleGenerate = async () => {
    if (!duration || !destination) {
      alert("Please select a trip duration and destination before generating your itinerary.")
      return
    }

    setIsGenerating(true)
    setItinerary(null)

    try {
      const response = await fetch("/api/gemini/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          durationDays: Number(duration),
          needs: selectedNeeds,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const data = await response.json()
      setItinerary(data.itinerary || "I couldn’t generate an itinerary right now. Please try again.")
    } catch (error) {
      console.error("Itinerary generation error", error)
      setItinerary("There was a problem talking to the AI. Please check your Gemini API key and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="planner" className="relative z-10 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm border border-border/50 shadow-xl rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-foreground">
              Let&apos;s Plan Your Family Trip
            </h2>
            <p className="text-foreground/60">Answer a few questions and we&apos;ll craft the perfect itinerary</p>
          </div>

          <div className="space-y-8">
            {/* Trip Duration */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/80">How long is your trip?</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full bg-muted/50 border-border/50 h-12 rounded-xl">
                  <SelectValue placeholder="Select your trip duration..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-border/50">
                  {durations.map((durationOption) => (
                    <SelectItem key={durationOption.value} value={durationOption.value}>
                      {durationOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground/50">
                Tip: Longer trips give you more time to explore at a relaxed pace with kids
              </p>
            </div>

            {/* Destination */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/80">Where would you like to go?</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full bg-muted/50 border-border/50 h-12 rounded-xl">
                  <SelectValue placeholder="Select a destination..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-border/50">
                  {destinations.map((dest) => (
                    <SelectItem key={dest.value} value={dest.value}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground/50">
                Not sure? Our AI can suggest destinations based on your preferences
              </p>
            </div>

            {/* What Do You Need */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/80">
                What&apos;s important for your trip?
              </label>
              <div className="flex flex-wrap gap-2">
                {needs.map((need) => {
                  const isSelected = selectedNeeds.includes(need.id)
                  return (
                    <button
                      key={need.id}
                      onClick={() => toggleNeed(need.id)}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                        "border",
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground font-medium"
                          : "bg-muted/50 border-border/50 text-foreground/70 hover:border-primary/50 hover:bg-primary/5",
                      )}
                    >
                      <span>{need.emoji}</span>
                      <span>{need.label}</span>
                      {isSelected && <X className="w-3 h-3 ml-1 opacity-60" />}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-foreground/50">Select all that apply to help us personalize your itinerary</p>
            </div>

            {/* Special Requirements */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/80">Any special requests? (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Budget preferences, dietary needs, accessibility requirements, ages of children..."
                className="bg-muted/50 border-border/50 rounded-xl min-h-[100px] resize-none"
              />
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  "w-full h-14 text-lg font-semibold rounded-xl relative overflow-hidden",
                  "bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)]",
                  "text-white border-0",
                  "hover:shadow-[0_4px_30px_oklch(0.86_0.09_50/0.45)] transition-all",
                )}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your itinerary...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate My Itinerary
                    <Sparkles className="w-5 h-5" />
                  </span>
                )}
                <div className="absolute inset-0 animate-shimmer" />
              </Button>
            </div>
          </div>
        </div>

        {itinerary && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm border border-border/50 shadow-md rounded-3xl p-6 sm:p-8 text-sm text-foreground/80 whitespace-pre-wrap">
            {itinerary}
          </div>
        )}
      </div>
    </section>
  )
}
