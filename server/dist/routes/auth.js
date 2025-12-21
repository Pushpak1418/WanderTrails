import { Router } from 'express';
import { z } from 'zod';
import { getEnv } from '../env.js';
import { authRequired } from '../middleware/auth.js';
import { AuthError, forgotPassword, getMe, login, resetPassword, signup } from '../services/auth-service.js';
const signupSchema = z.object({
    name: z.string().min(1, 'Name is required').max(80),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(200),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, 'Password must be at least 8 characters').max(200),
});
export const authRouter = Router();
authRouter.post('/signup', async (req, res, next) => {
    try {
        const body = signupSchema.parse(req.body);
        const { user, token } = await signup(body);
        setAuthCookie(res, token);
        return res.status(201).json({ user });
    }
    catch (err) {
        return next(err);
    }
});
authRouter.post('/login', async (req, res, next) => {
    try {
        const body = loginSchema.parse(req.body);
        const { user, token } = await login(body);
        setAuthCookie(res, token);
        return res.status(200).json({ user });
    }
    catch (err) {
        return next(err);
    }
});
authRouter.post('/logout', async (_req, res) => {
    const env = getEnv();
    res.clearCookie(env.COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
    });
    return res.status(204).send();
});
authRouter.post('/forgot-password', async (req, res, next) => {
    try {
        const body = forgotPasswordSchema.parse(req.body);
        const result = await forgotPassword(body);
        return res.status(200).json(result);
    }
    catch (err) {
        return next(err);
    }
});
authRouter.post('/reset-password', async (req, res, next) => {
    try {
        const body = resetPasswordSchema.parse(req.body);
        await resetPassword(body);
        return res.status(204).send();
    }
    catch (err) {
        return next(err);
    }
});
authRouter.get('/me', authRequired, async (req, res, next) => {
    try {
        const user = await getMe(req.userId);
        return res.status(200).json({ user });
    }
    catch (err) {
        return next(err);
    }
});
function setAuthCookie(res, token) {
    const env = getEnv();
    const maxAgeMs = env.TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
    res.cookie(env.COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        maxAge: maxAgeMs,
        path: '/',
    });
}
export function errorToHttp(err) {
    if (err instanceof AuthError)
        return { status: err.status, message: err.message };
    if (err instanceof z.ZodError)
        return { status: 400, message: err.issues[0]?.message ?? 'Invalid request' };
    const anyErr = err;
    const status = typeof anyErr?.status === 'number' ? anyErr.status : 500;
    const message = typeof anyErr?.message === 'string' ? anyErr.message : 'Server error';
    return { status, message };
}
