"use client"

import React, { useState } from "react"

interface Platform {
  platformName: string
  bookingUrl?: string
}

interface Option {
  optionType: string
  title: string
  description: string
  estimatedCostRange?: string
  recommendedPlatforms?: Platform[]
}

export default function AccommodationSearch({ optionType }: { optionType: string }) {
  const [destination, setDestination] = useState("")
  const [results, setResults] = useState<Option[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setResults(null)
    if (!destination) return setError("Enter a destination")

    setLoading(true)
    try {
      const res = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionType, destination }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed")
      setResults(data.options || [])
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Destination
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Paris"
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching…" : `Find ${optionType}`}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {results && (
        <div>
          {results.length === 0 && <div>No suggestions found.</div>}
          {results.map((r, idx) => (
            <div key={idx} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
              <strong>{r.title}</strong>
              {r.estimatedCostRange && <div>{r.estimatedCostRange}</div>}
              <div style={{ marginTop: 6 }}>{r.description}</div>
              {r.recommendedPlatforms && r.recommendedPlatforms.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div>Booking sites:</div>
                  <ul>
                    {r.recommendedPlatforms.map((p, i) => (
                      <li key={i}>
                        <a href={p.bookingUrl || "#"} target="_blank" rel="noreferrer">
                          {p.platformName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
