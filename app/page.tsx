import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MoodSelector } from "@/components/mood-selector"
import { AIChatbot } from "@/components/ai-chatbot"
import { ParticleBackground } from "@/components/particle-background"
import { TripSearchBar } from "@/components/trip-search-bar"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <TripSearchBar />
      <MoodSelector />
      <AIChatbot />
    </main>
  )
}
