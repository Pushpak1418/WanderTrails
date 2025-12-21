import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

import { getEnv } from '../env.js'

type JwtPayload = {
  sub?: string
}

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const env = getEnv()

  const token = extractToken(req, env.COOKIE_NAME)
  if (!token) {
    return next(Object.assign(new Error('Unauthorized'), { status: 401 }))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    if (!decoded.sub) {
      return next(Object.assign(new Error('Unauthorized'), { status: 401 }))
    }

    req.userId = decoded.sub
    return next()
  } catch {
    return next(Object.assign(new Error('Unauthorized'), { status: 401 }))
  }
}

export function extractToken(req: Request, cookieName: string): string | null {
  const cookieToken = (req.cookies?.[cookieName] as string | undefined) ?? undefined
  if (cookieToken) return cookieToken

  const auth = req.header('authorization')
  if (!auth) return null

  const match = auth.match(/^Bearer\s+(?<token>.+)$/i)
  return match?.groups?.token ?? null
}
