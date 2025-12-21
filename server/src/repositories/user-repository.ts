import fs from 'node:fs/promises'
import path from 'node:path'

import { nanoid } from 'nanoid'

import { getEnv } from '../env.js'

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

type StoredUser = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string

  resetTokenHash?: string
  resetTokenExpiresAt?: string
}

type Store = {
  users: StoredUser[]
}

async function readStore(): Promise<Store> {
  const env = getEnv()
  const filePath = env.USERS_FILE

  await fs.mkdir(path.dirname(filePath), { recursive: true })

  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as Store
    if (!parsed || !Array.isArray(parsed.users)) return { users: [] }
    return parsed
  } catch (err: any) {
    if (err?.code === 'ENOENT') return { users: [] }
    throw err
  }
}

async function writeStore(store: Store): Promise<void> {
  const env = getEnv()
  const filePath = env.USERS_FILE

  await fs.mkdir(path.dirname(filePath), { recursive: true })

  // Atomic write: write to temp file then rename
  const tmpPath = `${filePath}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(store, null, 2), 'utf8')
  await fs.rename(tmpPath, filePath)
}

export async function createUser(params: {
  name: string
  email: string
  passwordHash: string
}): Promise<User> {
  const store = await readStore()
  const now = new Date().toISOString()

  const user: StoredUser = {
    id: nanoid(),
    name: params.name,
    email: params.email,
    passwordHash: params.passwordHash,
    createdAt: now,
  }

  store.users.push(user)
  await writeStore(store)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

export async function findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const store = await readStore()
  const found = store.users.find((u) => u.email === email)
  if (!found) return null

  return {
    id: found.id,
    name: found.name,
    email: found.email,
    createdAt: found.createdAt,
    passwordHash: found.passwordHash,
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const store = await readStore()
  const found = store.users.find((u) => u.id === id)
  if (!found) return null

  return {
    id: found.id,
    name: found.name,
    email: found.email,
    createdAt: found.createdAt,
  }
}

export async function setPasswordResetToken(params: {
  email: string
  resetTokenHash: string
  resetTokenExpiresAt: string
}): Promise<void> {
  const store = await readStore()
  const found = store.users.find((u) => u.email === params.email)

  // Avoid leaking whether an email exists.
  if (!found) return

  found.resetTokenHash = params.resetTokenHash
  found.resetTokenExpiresAt = params.resetTokenExpiresAt
  await writeStore(store)
}

export async function findUserByResetTokenHash(
  resetTokenHash: string,
): Promise<(User & { passwordHash: string; resetTokenExpiresAt?: string }) | null> {
  const store = await readStore()
  const found = store.users.find((u) => u.resetTokenHash === resetTokenHash)
  if (!found) return null

  return {
    id: found.id,
    name: found.name,
    email: found.email,
    createdAt: found.createdAt,
    passwordHash: found.passwordHash,
    resetTokenExpiresAt: found.resetTokenExpiresAt,
  }
}

export async function updateUserPasswordAndClearReset(params: {
  userId: string
  passwordHash: string
}): Promise<void> {
  const store = await readStore()
  const found = store.users.find((u) => u.id === params.userId)
  if (!found) return

  found.passwordHash = params.passwordHash
  delete found.resetTokenHash
  delete found.resetTokenExpiresAt

  await writeStore(store)
}
