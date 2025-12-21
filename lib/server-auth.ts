import { cookies } from 'next/headers'

import { isSupabaseConfigured } from '@/lib/auth-config'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

export type ServerAuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

function mapSupabaseUser(u: any): ServerAuthUser {
  return {
    id: u.id,
    email: u.email ?? '',
    name: (u.user_metadata?.name as string | undefined) ?? (u.user_metadata?.full_name as string | undefined) ?? u.email ?? 'Traveler',
    createdAt: u.created_at ?? new Date().toISOString(),
  }
}

export async function getCurrentUser(): Promise<ServerAuthUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    return mapSupabaseUser(data.user)
  }

  // Fallback to local Express auth server (cookie-based)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

  // Next.js 16: cookies() is async
  const cookieStore = await cookies()
  const all = cookieStore.getAll()
  if (all.length === 0) return null

  // Serialize cookies for the upstream Express server.
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join('; ')

  const res = await fetch(`${apiUrl}/auth/me`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  })

  if (!res.ok) return null
  const data = (await res.json()) as { user: ServerAuthUser }
  return data.user
}
