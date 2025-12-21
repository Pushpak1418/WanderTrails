import { Navbar } from "@/components/navbar"
import { ItineraryForm } from "@/components/itinerary-form"
import { ParticleBackground } from "@/components/particle-background"

export default function PlannerPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <section className="relative z-10 pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-3 text-foreground">
            Itinerary Planner
          </h1>
          <p className="text-foreground/60 text-lg">
            Answer a few quick questions and we&apos;ll craft a custom trip plan for you.
          </p>
        </div>
        <ItineraryForm />
      </section>
    </main>
  )
}
