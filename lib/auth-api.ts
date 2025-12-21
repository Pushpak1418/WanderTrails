import { apiFetch } from '@/lib/api-client'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export async function signup(input: { name: string; email: string; password: string }) {
  return apiFetch<{ user: AuthUser }>('/auth/signup', { method: 'POST', body: input })
}

export async function login(input: { email: string; password: string }) {
  return apiFetch<{ user: AuthUser }>('/auth/login', { method: 'POST', body: input })
}

export async function logout() {
  await apiFetch<unknown>('/auth/logout', { method: 'POST' })
}

export async function me() {
  return apiFetch<{ user: AuthUser }>('/auth/me', { method: 'GET' })
}

export async function forgotPassword(input: { email: string }) {
  return apiFetch<{ ok: true; resetUrl?: string }>('/auth/forgot-password', { method: 'POST', body: input })
}

export async function resetPassword(input: { token: string; password: string }) {
  await apiFetch<unknown>('/auth/reset-password', { method: 'POST', body: input })
}
