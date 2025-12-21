'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Navbar } from '@/components/navbar'
import { ParticleBackground } from '@/components/particle-background'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { user, login } = useAuth()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    setIsSubmitting(true)
    try {
      const res = await login({ email, password })
      if (!res.ok) {
        setError(res.error)
        return
      }

      toast({
        title: `Welcome back, ${res.user.name}!`,
        description: 'Your next trail is waiting.',
      })

      setSuccess(`Welcome back, ${res.user.name}.`)
      router.push('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-border/50 shadow-xl rounded-3xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3 text-balance">
                <span className="bg-gradient-to-r from-[oklch(0.55_0.18_250)] via-[oklch(0.6_0.15_230)] to-[oklch(0.62_0.16_25)] bg-clip-text text-transparent">
                  Welcome back
                </span>
              </h1>
              <p className="text-foreground/60">Pick up where your last daydream left off.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">Email</label>
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  className="h-12 rounded-xl bg-muted/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground/80">Password</label>
                  <Link
                    href={`/forgot-password?email=${encodeURIComponent(email)}`}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secret trail name"
                  className="h-12 rounded-xl bg-muted/50 border-border/50"
                  required
                />
              </div>

              {(error || success) && (
                <div
                  className={cn(
                    'rounded-xl border px-4 py-3 text-sm',
                    error
                      ? 'border-destructive/20 bg-destructive/5 text-destructive'
                      : 'border-primary/20 bg-primary/5 text-foreground',
                  )}
                >
                  {error ?? success}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 font-semibold rounded-xl relative overflow-hidden',
                  'bg-gradient-to-r from-[oklch(0.65_0.18_250)] via-[oklch(0.7_0.15_230)] to-[oklch(0.72_0.16_25)]',
                  'text-white border-0',
                  'hover:shadow-[0_4px_30px_oklch(0.65_0.18_250/0.4)] transition-all',
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing you in...
                  </span>
                ) : (
                  'Login'
                )}
                <div className="absolute inset-0 animate-shimmer" />
              </Button>

              <p className="text-center text-sm text-foreground/60">
                New here?{' '}
                <Link href="/signup" className="font-medium text-foreground hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
