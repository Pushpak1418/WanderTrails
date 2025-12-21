import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),

  JWT_SECRET: z.string().min(20, 'JWT_SECRET must be at least 20 characters'),
  COOKIE_NAME: z.string().default('wandertrails_token'),
  TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),

  // File-based persistence to keep local dev friction-free on Windows
  USERS_FILE: z.string().default('./data/users.json'),

  // Password reset (local server only)
  RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().int().positive().default(30),
})

export type Env = z.infer<typeof envSchema>

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Invalid environment:\n${message}`)
  }
  return parsed.data
}
