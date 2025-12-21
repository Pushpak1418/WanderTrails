import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnv } from './env.js';
import { authRouter, errorToHttp } from './routes/auth.js';
// Load env in a way that works whether the server is started from /server or from the repo root.
{
    const here = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
        path.resolve(here, '../.env'),
        path.resolve(here, '../.env.local'),
        path.resolve(here, '../../.env'),
        path.resolve(here, '../../.env.local'),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            dotenv.config({ path: p });
            break;
        }
    }
}
const env = getEnv();
const app = express();
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
    origin(origin, callback) {
        // Allow non-browser clients (curl, server-to-server)
        if (!origin)
            return callback(null, true);
        // Allow explicit origins
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        // In dev, allow any localhost port to prevent "Next picked a different port" CORS issues.
        if (env.NODE_ENV !== 'production') {
            const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
            if (isLocalhost)
                return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/auth', authRouter);
app.use((err, _req, res, _next) => {
    const { status, message } = errorToHttp(err);
    res.status(status).json({ error: message });
});
app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Auth server listening on http://localhost:${env.PORT}`);
});
