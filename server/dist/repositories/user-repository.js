import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { getEnv } from '../env.js';
async function readStore() {
    const env = getEnv();
    const filePath = env.USERS_FILE;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    try {
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.users))
            return { users: [] };
        return parsed;
    }
    catch (err) {
        if (err?.code === 'ENOENT')
            return { users: [] };
        throw err;
    }
}
async function writeStore(store) {
    const env = getEnv();
    const filePath = env.USERS_FILE;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Atomic write: write to temp file then rename
    const tmpPath = `${filePath}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(store, null, 2), 'utf8');
    await fs.rename(tmpPath, filePath);
}
export async function createUser(params) {
    const store = await readStore();
    const now = new Date().toISOString();
    const user = {
        id: nanoid(),
        name: params.name,
        email: params.email,
        passwordHash: params.passwordHash,
        createdAt: now,
    };
    store.users.push(user);
    await writeStore(store);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
}
export async function findUserByEmail(email) {
    const store = await readStore();
    const found = store.users.find((u) => u.email === email);
    if (!found)
        return null;
    return {
        id: found.id,
        name: found.name,
        email: found.email,
        createdAt: found.createdAt,
        passwordHash: found.passwordHash,
    };
}
export async function findUserById(id) {
    const store = await readStore();
    const found = store.users.find((u) => u.id === id);
    if (!found)
        return null;
    return {
        id: found.id,
        name: found.name,
        email: found.email,
        createdAt: found.createdAt,
    };
}
export async function setPasswordResetToken(params) {
    const store = await readStore();
    const found = store.users.find((u) => u.email === params.email);
    // Avoid leaking whether an email exists.
    if (!found)
        return;
    found.resetTokenHash = params.resetTokenHash;
    found.resetTokenExpiresAt = params.resetTokenExpiresAt;
    await writeStore(store);
}
export async function findUserByResetTokenHash(resetTokenHash) {
    const store = await readStore();
    const found = store.users.find((u) => u.resetTokenHash === resetTokenHash);
    if (!found)
        return null;
    return {
        id: found.id,
        name: found.name,
        email: found.email,
        createdAt: found.createdAt,
        passwordHash: found.passwordHash,
        resetTokenExpiresAt: found.resetTokenExpiresAt,
    };
}
export async function updateUserPasswordAndClearReset(params) {
    const store = await readStore();
    const found = store.users.find((u) => u.id === params.userId);
    if (!found)
        return;
    found.passwordHash = params.passwordHash;
    delete found.resetTokenHash;
    delete found.resetTokenExpiresAt;
    await writeStore(store);
}
