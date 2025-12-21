"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Navbar } from '@/components/navbar'
import { ParticleBackground } from '@/components/particle-background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { isSupabaseConfigured } from '@/lib/auth-config'
import * as authApi from '@/lib/auth-api'
import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { cn } from '@/lib/utils'

export default function ForgotPasswordClient() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''

  const [email, setEmail] = React.useState(initialEmail)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [resetUrl, setResetUrl] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setResetUrl(null)

    setIsSubmitting(true)
    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
          setError(error.message)
          return
        }

        toast({
          title: 'Check your email',
          description: 'We sent you a reset link if the address exists.',
        })
        setSuccess('If that email exists, we sent a password reset link.')
        return
      }

      const res = await authApi.forgotPassword({ email })

      toast({
        title: 'Reset link generated',
        description: res.resetUrl
          ? 'In local dev, we show the reset link on screen.'
          : 'If that email exists, you’ll be able to reset your password.',
      })

      setSuccess('If that email exists, you’ll get a reset option.')
      if (res.resetUrl) setResetUrl(res.resetUrl)
    } catch (err: any) {
      setError(typeof err?.message === 'string' ? err.message : 'Request failed')
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
                  Reset your password
                </span>
              </h1>
              <p className="text-foreground/60">We’ll help you find your way back to your journeys.</p>
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

              {resetUrl && (
                <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm">
                  <p className="font-medium text-foreground mb-2">Local dev reset link</p>
                  <a className="break-all underline" href={resetUrl}>
                    {resetUrl}
                  </a>
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
                {isSubmitting ? 'Sending…' : 'Send reset link'}
                <div className="absolute inset-0 animate-shimmer" />
              </Button>

              <p className="text-center text-sm text-foreground/60">
                Remembered it?{' '}
                <Link href="/login" className="font-medium text-foreground hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
