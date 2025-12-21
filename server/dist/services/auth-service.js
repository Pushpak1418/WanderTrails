import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEnv } from '../env.js';
import { createUser, findUserByEmail, findUserById, findUserByResetTokenHash, setPasswordResetToken, updateUserPasswordAndClearReset, } from '../repositories/user-repository.js';
export class AuthError extends Error {
    status;
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
export async function signup(params) {
    const env = getEnv();
    const email = params.email.trim().toLowerCase();
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new AuthError('That email is already on this journey. Try logging in instead.', 409);
    }
    const passwordHash = await bcrypt.hash(params.password, 10);
    const user = await createUser({ name: params.name.trim(), email, passwordHash });
    const token = signToken(user.id, env);
    return { user, token };
}
export async function login(params) {
    const env = getEnv();
    const email = params.email.trim().toLowerCase();
    const found = await findUserByEmail(email);
    if (!found) {
        throw new AuthError("We couldn't find that email. Maybe it's a different one?", 401);
    }
    const ok = await bcrypt.compare(params.password, found.passwordHash);
    if (!ok) {
        throw new AuthError("That password doesn't match. Let's try again.", 401);
    }
    const user = {
        id: found.id,
        name: found.name,
        email: found.email,
        createdAt: found.createdAt,
    };
    const token = signToken(user.id, env);
    return { user, token };
}
export async function getMe(userId) {
    const user = await findUserById(userId);
    if (!user) {
        throw new AuthError('Session expired. Please log in again.', 401);
    }
    return user;
}
export async function forgotPassword(params) {
    const env = getEnv();
    const email = params.email.trim().toLowerCase();
    // If user exists, set a one-time reset token; otherwise, do nothing (avoid account enumeration).
    const existing = await findUserByEmail(email);
    if (!existing)
        return { ok: true };
    const token = crypto.randomBytes(24).toString('hex');
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + env.RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000).toISOString();
    await setPasswordResetToken({
        email,
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: expiresAt,
    });
    // In a real app you'd email this link. For local dev, we return it to the UI.
    const resetUrl = `${env.CLIENT_ORIGIN}/reset-password?token=${token}`;
    return { ok: true, resetUrl };
}
export async function resetPassword(params) {
    const env = getEnv();
    if (!params.token) {
        throw new AuthError('Invalid reset link.', 400);
    }
    const tokenHash = hashToken(params.token);
    const found = await findUserByResetTokenHash(tokenHash);
    if (!found) {
        throw new AuthError('That reset link is invalid or has expired.', 400);
    }
    const expiresAt = found.resetTokenExpiresAt ? Date.parse(found.resetTokenExpiresAt) : NaN;
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
        throw new AuthError('That reset link is invalid or has expired.', 400);
    }
    const passwordHash = await bcrypt.hash(params.password, 10);
    await updateUserPasswordAndClearReset({ userId: found.id, passwordHash });
    return { ok: true };
}
function signToken(userId, env) {
    const expiresInSeconds = env.TOKEN_EXPIRES_DAYS * 24 * 60 * 60;
    return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: expiresInSeconds });
}
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
