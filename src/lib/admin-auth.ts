import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { compareSync, hashSync } from 'bcryptjs';
import { getDb } from '@/lib/db';

const AUTH_COOKIE_NAME = 'vor_admin_session';

export type AdminRole = 'admin' | 'editor';

export type AdminUser = {
  id: number;
  username: string;
  role: AdminRole;
  createdAt: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  // Emergency fallback to keep admin login working when env vars are missing.
  // Set ADMIN_SESSION_SECRET in production as soon as possible.
  return 'vor-enterprise-secret-change-me';
}

export function createAdminToken(username: string): string {
  const payload = username;
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyTokenPayload(token: string | undefined): string | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expected = createAdminToken(payload).split('.')[1];

  if (!expected) {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length) {
    return null;
  }

  if (!timingSafeEqual(a, b)) {
    return null;
  }

  return payload;
}

export function isValidAdminToken(token: string | undefined): boolean {
  return Boolean(verifyTokenPayload(token));
}

export function verifyAdminCredentials(username: string, password: string): AdminUser | null {
  if (!username || !password) {
    return null;
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, username, password_hash, role, created_at FROM admin_users WHERE username = ? LIMIT 1')
    .get(username) as
    | { id: number; username: string; password_hash: string; role: AdminRole; created_at: string }
    | undefined;

  if (!user) {
    return null;
  }

  if (!compareSync(password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.created_at,
  };
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = verifyTokenPayload(token);

  if (!payload) {
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT id, username, role, created_at FROM admin_users WHERE username = ? LIMIT 1')
    .get(payload) as { id: number; username: string; role: AdminRole; created_at: string } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getSessionUser());
}

export function listAdminUsers(): AdminUser[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, username, role, created_at FROM admin_users ORDER BY id ASC')
    .all() as Array<{ id: number; username: string; role: AdminRole; created_at: string }>;

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
  }));
}

export function createAdminUser(input: { username: string; password: string; role: AdminRole }): { ok: boolean; message: string } {
  const username = input.username.trim();
  const password = input.password.trim();

  if (username.length < 3) {
    return { ok: false, message: 'El usuario debe tener minimo 3 caracteres.' };
  }

  if (password.length < 8) {
    return { ok: false, message: 'La contrasena debe tener minimo 8 caracteres.' };
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM admin_users WHERE username = ? LIMIT 1').get(username) as { id: number } | undefined;

  if (existing) {
    return { ok: false, message: 'El usuario ya existe.' };
  }

  const hash = hashSync(password, 10);
  db.prepare('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, input.role);

  return { ok: true, message: 'Usuario creado correctamente.' };
}

export { AUTH_COOKIE_NAME };
