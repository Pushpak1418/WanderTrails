'use client'

import React from 'react'

import * as authApi from '@/lib/auth-api'
import { isSupabaseConfigured } from '@/lib/auth-config'
import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthUser = authApi.AuthUser

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (
    input: { email: string; password: string },
  ) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>
  signup: (
    input: { name: string; email: string; password: string },
  ) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function mapSupabaseUser(u: any): AuthUser {
  return {
    id: u.id,
    email: u.email ?? '',
    name: (u.user_metadata?.name as string | undefined) ?? (u.user_metadata?.full_name as string | undefined) ?? u.email ?? 'Traveler',
    createdAt: u.created_at ?? new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const useSupabase = isSupabaseConfigured()

  const refresh = React.useCallback(async () => {
    try {
      if (useSupabase) {
        const supabase = createSupabaseBrowserClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          setUser(null)
        } else {
          setUser(mapSupabaseUser(data.user))
        }
        return
      }

      const res = await authApi.me()
      setUser(res.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [useSupabase])

  React.useEffect(() => {
    refresh()

    if (!useSupabase) return

    const supabase = createSupabaseBrowserClient()
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null)
        return
      }
      setUser(mapSupabaseUser(session.user))
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [refresh, useSupabase])

  const loginFn: AuthContextValue['login'] = React.useCallback(
    async (input) => {
      try {
        if (useSupabase) {
          const supabase = createSupabaseBrowserClient()
          const { data, error } = await supabase.auth.signInWithPassword({
            email: input.email,
            password: input.password,
          })

          if (error || !data.user) {
            return { ok: false, error: error?.message ?? "That didn't work — try again." }
          }

          const u = mapSupabaseUser(data.user)
          setUser(u)
          return { ok: true, user: u }
        }

        const res = await authApi.login(input)
        setUser(res.user)
        return { ok: true, user: res.user }
      } catch (err: any) {
        return { ok: false, error: typeof err?.message === 'string' ? err.message : 'Login failed' }
      }
    },
    [useSupabase],
  )

  const signupFn: AuthContextValue['signup'] = React.useCallback(
    async (input) => {
      try {
        if (useSupabase) {
          const supabase = createSupabaseBrowserClient()
          const { data, error } = await supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
              data: { name: input.name },
            },
          })

          if (error || !data.user) {
            return { ok: false, error: error?.message ?? 'Signup failed' }
          }

          const u = mapSupabaseUser(data.user)
          setUser(u)
          return { ok: true, user: u }
        }

        const res = await authApi.signup(input)
        setUser(res.user)
        return { ok: true, user: res.user }
      } catch (err: any) {
        return { ok: false, error: typeof err?.message === 'string' ? err.message : 'Signup failed' }
      }
    },
    [useSupabase],
  )

  const logoutFn: AuthContextValue['logout'] = React.useCallback(async () => {
    try {
      if (useSupabase) {
        const supabase = createSupabaseBrowserClient()
        await supabase.auth.signOut()
        return
      }

      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [useSupabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: loginFn,
        signup: signupFn,
        logout: logoutFn,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider />')
  }
  return ctx
}
