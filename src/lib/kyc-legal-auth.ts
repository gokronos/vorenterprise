import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { compareSync, hashSync } from 'bcryptjs';
import { getDb } from '@/lib/db';

export const KYC_LEGAL_AUTH_COOKIE_NAME = 'vor_kyc_legal_session';

export type KycLegalUser = {
  id: number;
  numeroIdentificacion: string;
  createdAt: string;
  updatedAt: string;
};

function getKycLegalSessionSecret() {
  const secret = process.env.KYC_LEGAL_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing KYC_LEGAL_SESSION_SECRET in production environment.');
  }

  return 'vor-kyc-legal-secret-change-me';
}

function normalizeId(value: string): string {
  return value.trim().replace(/\s+/g, '');
}

export function createKycLegalToken(numeroIdentificacion: string): string {
  const payload = normalizeId(numeroIdentificacion);
  const signature = createHmac('sha256', getKycLegalSessionSecret()).update(payload).digest('base64url');
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

  const expected = createKycLegalToken(payload).split('.')[1];
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

export function registerKycLegalUser(input: {
  numeroIdentificacion: string;
  password: string;
  confirmPassword: string;
}): { ok: boolean; message: string; user?: KycLegalUser } {
  const numeroIdentificacion = normalizeId(input.numeroIdentificacion);
  const password = input.password.trim();
  const confirmPassword = input.confirmPassword.trim();

  if (!/^\d{5,20}$/.test(numeroIdentificacion)) {
    return { ok: false, message: 'El numero de identificacion debe tener entre 5 y 20 digitos numericos.' };
  }

  if (password.length < 8) {
    return { ok: false, message: 'La contrasena debe tener minimo 8 caracteres.' };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'La verificacion de contrasena no coincide.' };
  }

  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM kyc_legal_users WHERE numero_identificacion = ? LIMIT 1')
    .get(numeroIdentificacion) as { id: number } | undefined;

  if (existing) {
    return { ok: false, message: 'Ya existe una cuenta juridica con este numero de identificacion.' };
  }

  const hash = hashSync(password, 10);
  const result = db
    .prepare(
      `INSERT INTO kyc_legal_users (numero_identificacion, password_hash, created_at, updated_at)
       VALUES (?, ?, datetime('now'), datetime('now'))`
    )
    .run(numeroIdentificacion, hash);

  const user = db
    .prepare('SELECT id, numero_identificacion, created_at, updated_at FROM kyc_legal_users WHERE id = ? LIMIT 1')
    .get(result.lastInsertRowid) as { id: number; numero_identificacion: string; created_at: string; updated_at: string };

  db
    .prepare(
      `INSERT OR IGNORE INTO kyc_legal_profiles (
        user_id,
        numero_identificacion,
        updated_at
      ) VALUES (?, ?, datetime('now'))`
    )
    .run(user.id, user.numero_identificacion);

  return {
    ok: true,
    message: 'Cuenta juridica creada correctamente.',
    user: {
      id: user.id,
      numeroIdentificacion: user.numero_identificacion,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  };
}

export function verifyKycLegalCredentials(numeroIdentificacionInput: string, passwordInput: string): KycLegalUser | null {
  const numeroIdentificacion = normalizeId(numeroIdentificacionInput);
  const password = passwordInput.trim();

  if (!numeroIdentificacion || !password) {
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT id, numero_identificacion, password_hash, created_at, updated_at FROM kyc_legal_users WHERE numero_identificacion = ? LIMIT 1')
    .get(numeroIdentificacion) as
    | { id: number; numero_identificacion: string; password_hash: string; created_at: string; updated_at: string }
    | undefined;

  if (!row) {
    return null;
  }

  if (!compareSync(password, row.password_hash)) {
    return null;
  }

  return {
    id: row.id,
    numeroIdentificacion: row.numero_identificacion,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getKycLegalSessionUser(): Promise<KycLegalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(KYC_LEGAL_AUTH_COOKIE_NAME)?.value;
  const numeroIdentificacion = verifyTokenPayload(token);

  if (!numeroIdentificacion) {
    return null;
  }

  const db = getDb();
  const row = db
    .prepare('SELECT id, numero_identificacion, created_at, updated_at FROM kyc_legal_users WHERE numero_identificacion = ? LIMIT 1')
    .get(numeroIdentificacion) as { id: number; numero_identificacion: string; created_at: string; updated_at: string } | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    numeroIdentificacion: row.numero_identificacion,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
