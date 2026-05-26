import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { compareSync, hashSync } from 'bcryptjs';
import { getDb } from '@/lib/db';

export const KYC_AUTH_COOKIE_NAME = 'vor_kyc_session';

export type KycUser = {
  id: number;
  cedula: string;
  createdAt: string;
  updatedAt: string;
};

function getKycSessionSecret() {
  const secret = process.env.KYC_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing KYC_SESSION_SECRET in production environment.');
  }

  return 'vor-kyc-secret-change-me';
}

function normalizeCedula(value: string): string {
  return value.trim().replace(/\s+/g, '');
}

export function createKycToken(cedula: string): string {
  const payload = normalizeCedula(cedula);
  const signature = createHmac('sha256', getKycSessionSecret()).update(payload).digest('base64url');
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

  const expected = createKycToken(payload).split('.')[1];
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

export function validateCedula(cedula: string): { ok: boolean; message: string } {
  const normalized = normalizeCedula(cedula);

  if (!/^\d{5,20}$/.test(normalized)) {
    return { ok: false, message: 'La cedula debe tener entre 5 y 20 digitos numericos.' };
  }

  return { ok: true, message: '' };
}

export function validatePassword(password: string): { ok: boolean; message: string } {
  const raw = password.trim();

  if (raw.length < 8) {
    return { ok: false, message: 'La contrasena debe tener minimo 8 caracteres.' };
  }

  return { ok: true, message: '' };
}

export function registerKycUser(input: {
  cedula: string;
  password: string;
  confirmPassword: string;
}): { ok: boolean; message: string; user?: KycUser } {
  const cedula = normalizeCedula(input.cedula);
  const password = input.password.trim();
  const confirmPassword = input.confirmPassword.trim();

  const cedulaValidation = validateCedula(cedula);
  if (!cedulaValidation.ok) {
    return { ok: false, message: cedulaValidation.message };
  }

  const passValidation = validatePassword(password);
  if (!passValidation.ok) {
    return { ok: false, message: passValidation.message };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'La verificacion de contrasena no coincide.' };
  }

  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM kyc_natural_users WHERE cedula = ? LIMIT 1')
    .get(cedula) as { id: number } | undefined;

  if (existing) {
    return { ok: false, message: 'Ya existe una cuenta KYC con esta cedula.' };
  }

  const hash = hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO kyc_natural_users (cedula, password_hash, created_at, updated_at) VALUES (?, ?, datetime(\'now\'), datetime(\'now\'))')
    .run(cedula, hash);

  const user = db
    .prepare('SELECT id, cedula, created_at, updated_at FROM kyc_natural_users WHERE id = ? LIMIT 1')
    .get(result.lastInsertRowid) as { id: number; cedula: string; created_at: string; updated_at: string };

  db
    .prepare(
      `INSERT OR IGNORE INTO kyc_natural_profiles (
        user_id,
        numero_identificacion,
        updated_at
      ) VALUES (?, ?, datetime('now'))`
    )
    .run(user.id, user.cedula);

  return {
    ok: true,
    message: 'Cuenta creada correctamente.',
    user: {
      id: user.id,
      cedula: user.cedula,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  };
}

export function verifyKycCredentials(cedulaInput: string, passwordInput: string): KycUser | null {
  const cedula = normalizeCedula(cedulaInput);
  const password = passwordInput.trim();

  if (!cedula || !password) {
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT id, cedula, password_hash, created_at, updated_at FROM kyc_natural_users WHERE cedula = ? LIMIT 1')
    .get(cedula) as
    | { id: number; cedula: string; password_hash: string; created_at: string; updated_at: string }
    | undefined;

  if (!row) {
    return null;
  }

  if (!compareSync(password, row.password_hash)) {
    return null;
  }

  return {
    id: row.id,
    cedula: row.cedula,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getKycSessionUser(): Promise<KycUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(KYC_AUTH_COOKIE_NAME)?.value;
  const cedula = verifyTokenPayload(token);

  if (!cedula) {
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT id, cedula, created_at, updated_at FROM kyc_natural_users WHERE cedula = ? LIMIT 1')
    .get(cedula) as { id: number; cedula: string; created_at: string; updated_at: string } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    cedula: row.cedula,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
