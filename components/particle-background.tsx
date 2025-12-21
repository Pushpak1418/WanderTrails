"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []
    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full pointer-events-none"

      const size = Math.random() * 6 + 3
      const x = Math.random() * 100
      const y = Math.random() * 100
      const delay = Math.random() * 4
      const duration = Math.random() * 4 + 4

      const colors = [
        "bg-[oklch(0.7_0.15_230/0.3)]", // sky blue
        "bg-[oklch(0.72_0.16_25/0.25)]", // coral
        "bg-[oklch(0.75_0.12_160/0.3)]", // mint
        "bg-[oklch(0.85_0.15_85/0.35)]", // sunshine
        "bg-[oklch(0.8_0.1_290/0.25)]", // lavender
      ]

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}%`
      particle.style.top = `${y}%`
      particle.style.animationDelay = `${delay}s`
      particle.style.animationDuration = `${duration}s`
      particle.classList.add("animate-particle", colors[Math.floor(Math.random() * colors.length)])

      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.96 0.03 290) 0%, oklch(0.98 0.02 95) 45%, oklch(0.95 0.04 70) 100%)",
      }}
    />
  )
}
