import jwt from 'jsonwebtoken';
import { getEnv } from '../env.js';
export function authRequired(req, _res, next) {
    const env = getEnv();
    const token = extractToken(req, env.COOKIE_NAME);
    if (!token) {
        return next(Object.assign(new Error('Unauthorized'), { status: 401 }));
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!decoded.sub) {
            return next(Object.assign(new Error('Unauthorized'), { status: 401 }));
        }
        req.userId = decoded.sub;
        return next();
    }
    catch {
        return next(Object.assign(new Error('Unauthorized'), { status: 401 }));
    }
}
export function extractToken(req, cookieName) {
    const cookieToken = req.cookies?.[cookieName] ?? undefined;
    if (cookieToken)
        return cookieToken;
    const auth = req.header('authorization');
    if (!auth)
        return null;
    const match = auth.match(/^Bearer\s+(?<token>.+)$/i);
    return match?.groups?.token ?? null;
}
