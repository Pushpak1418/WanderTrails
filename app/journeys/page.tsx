'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { Navbar } from '@/components/navbar'
import { ParticleBackground } from '@/components/particle-background'
import { useAuth } from '@/components/auth/auth-provider'

export default function JourneysPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <ParticleBackground />
        <Navbar />

        <section className="relative z-10 pt-32 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm border border-border/50 shadow-xl rounded-3xl p-8 sm:p-12">
              <p className="text-foreground/60">Loading your journeys…</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-border/50 shadow-xl rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3 text-foreground">My Journeys</h1>
              <p className="text-foreground/60">
                Welcome, <span className="font-medium text-foreground">{user.name}</span>. This is where we’ll keep the trips you don’t want
                to forget.
              </p>

              <div className="mt-10 grid gap-4">
                <div className="rounded-2xl border border-border/50 bg-muted/30 px-6 py-5 text-left">
                  <p className="text-sm font-medium text-foreground">No saved journeys yet</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    When you generate itineraries, you’ll be able to pin the ones that feel like “this is it.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
