"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient()
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
          setError(error.message)
          return
        }

        toast({ title: 'Password updated', description: 'You can continue to your journeys.' })
        setSuccess('Password updated.')
        router.push('/journeys')
        return
      }

      if (!token) {
        setError('Missing reset token. Please use the reset link again.')
        return
      }

      await authApi.resetPassword({ token, password })
      toast({ title: 'Password reset', description: 'You can log in with your new password.' })
      setSuccess('Password reset. Redirecting to login…')
      router.push('/login')
    } catch (err: any) {
      setError(typeof err?.message === 'string' ? err.message : 'Reset failed')
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
                  Set a new password
                </span>
              </h1>
              <p className="text-foreground/60">Choose something only you would know.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">New password</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-12 rounded-xl bg-muted/50 border-border/50"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">Confirm password</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  className="h-12 rounded-xl bg-muted/50 border-border/50"
                  required
                  minLength={8}
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
                {isSubmitting ? 'Saving…' : 'Update password'}
                <div className="absolute inset-0 animate-shimmer" />
              </Button>

              <p className="text-center text-sm text-foreground/60">
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
