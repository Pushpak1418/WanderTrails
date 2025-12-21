"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, CalendarRange, Search } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CurrencyChoice } from "@/lib/currency"

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

export function TripSearchBar() {
  const router = useRouter()
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [customDestination, setCustomDestination] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [currency, setCurrency] = useState<CurrencyChoice>("usd")

  const resolvedDestination = (customDestination || selectedDestination).trim()

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()

    if (!resolvedDestination || !startDate || !endDate) {
      // Lightweight validation – you can replace with a nicer UI later
      alert("Please select a destination, start date, and end date.")
      return
    }

    const params = new URLSearchParams({
      destination: resolvedDestination,
      start: startDate,
      end: endDate,
      currency,
    })

    router.push(`/explore?${params.toString()}`)
  }

  return (
    <section
      id="trip-search"
      className="relative z-10 -mt-6 pb-8 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="glassmorphism rounded-2xl px-4 sm:px-6 py-4 sm:py-5 border border-border/50">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3"
          >
            {/* Destination */}
            <div className="flex-1 space-y-2">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-foreground/60 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[oklch(0.78_0.08_50)]" />
                  Destination
                </label>
                <Select onValueChange={setSelectedDestination}>
                  <SelectTrigger className="w-full bg-muted/50 border-border/50 h-11 rounded-xl text-sm">
                    <SelectValue placeholder="Top suggested destinations" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border/50 max-h-64">
                    {destinations.map((dest) => (
                      <SelectItem key={dest.value} value={dest.value}>
                        {dest.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-foreground/50 mb-1 block">
                  Or type any destination in the world
                </label>
                <Input
                  type="text"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  placeholder="e.g. Zurich, Switzerland"
                  className="h-10 rounded-xl bg-muted/40 border-border/40 text-sm"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-foreground/60 mb-1.5">
                  <CalendarRange className="w-3.5 h-3.5 text-[oklch(0.78_0.08_50)]" />
                  Start date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl bg-muted/50 border-border/50 text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-foreground/60 mb-1.5">
                  <CalendarRange className="w-3.5 h-3.5 text-[oklch(0.78_0.08_50)]" />
                  End date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 rounded-xl bg-muted/50 border-border/50 text-sm"
                />
              </div>
            </div>

            {/* Currency + Search button */}
            <div className="w-full md:w-auto flex flex-col gap-3">
              <div className="flex items-center md:justify-end gap-2 text-[11px] text-foreground/60">
                <span className="font-medium">Currency</span>
                <div className="inline-flex rounded-full bg-muted/60 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCurrency("usd")}
                    className={`px-2.5 py-1 rounded-full ${
                      currency === "usd" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("local")}
                    className={`px-2.5 py-1 rounded-full ${
                      currency === "local" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    Local
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("inr")}
                    className={`px-2.5 py-1 rounded-full ${
                      currency === "inr" ? "bg-white text-foreground shadow-sm" : "text-foreground/60"
                    }`}
                  >
                    INR
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 md:h-12 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.88_0.08_80)] via-[oklch(0.86_0.09_50)] to-[oklch(0.84_0.08_320)] text-white font-semibold hover:opacity-95 transition-all hover:shadow-[0_4px_20px_oklch(0.86_0.09_50/0.4)] border-0"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
