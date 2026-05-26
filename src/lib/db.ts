import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { hashSync } from 'bcryptjs';

type DbInstance = Database.Database;

const DEFAULT_DOCUMENT_URLS = {
  sagrilaft: '/documentos/sagrilaft-legal-1779506207378.pdf',
  organigrama: '/documentos/organigrama-organigrama-20de7fde-1779505721154.jpg',
  politicaDatos: '/documentos/politica-datos-tratamiento-de-datos-1779506215778.pdf',
} as const;

declare global {
  var __vorDb__: DbInstance | undefined;
}

function getDatabasePath() {
  const raw = process.env.DATABASE_PATH?.trim();
  if (!raw) {
    return join(process.cwd(), 'data', 'vorenterprise.db');
  }

  if (raw.startsWith('/') || raw.includes(':\\')) {
    return raw;
  }

  return join(process.cwd(), raw);
}

function getDatabaseCandidates() {
  const candidates: string[] = [];
  const preferred = getDatabasePath();

  candidates.push(preferred);

  // Hostinger/Linux usually allows writes under /tmp when app root is read-only.
  if (!candidates.includes('/tmp/vorenterprise.db')) {
    candidates.push('/tmp/vorenterprise.db');
  }

  return candidates;
}

function getBootstrapAdmin() {
  return {
    username: process.env.ADMIN_USER?.trim() || 'admin',
    password: process.env.ADMIN_PASSWORD?.trim() || 'admin12345',
  };
}

function initializeDb(db: DbInstance) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compliance_documents (
      doc_key TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      pdf_url TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by INTEGER,
      FOREIGN KEY(updated_by) REFERENCES admin_users(id)
    );

    CREATE TABLE IF NOT EXISTS sagrilaft_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      pdf_url TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS kyc_natural_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cedula TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS kyc_natural_profiles (
      user_id INTEGER PRIMARY KEY,
      nombres_completos TEXT NOT NULL DEFAULT '',
      numero_identificacion TEXT NOT NULL DEFAULT '',
      tipo_identificacion TEXT NOT NULL DEFAULT '',
      nacionalidad TEXT NOT NULL DEFAULT '',
      ciudad TEXT NOT NULL DEFAULT '',
      direccion TEXT NOT NULL DEFAULT '',
      correo_electronico TEXT NOT NULL DEFAULT '',
      telefono_celular TEXT NOT NULL DEFAULT '',
      origen_fondos TEXT NOT NULL DEFAULT '',
      cc_file_url TEXT NOT NULL DEFAULT '',
      rut_file_url TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES kyc_natural_users(id)
    );

    CREATE TABLE IF NOT EXISTS kyc_legal_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_identificacion TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS kyc_legal_profiles (
      user_id INTEGER PRIMARY KEY,
      nombres_completos TEXT NOT NULL DEFAULT '',
      numero_identificacion TEXT NOT NULL DEFAULT '',
      tipo_identificacion TEXT NOT NULL DEFAULT '',
      nacionalidad TEXT NOT NULL DEFAULT '',
      ciudad TEXT NOT NULL DEFAULT '',
      direccion TEXT NOT NULL DEFAULT '',
      correo_electronico TEXT NOT NULL DEFAULT '',
      telefono_celular TEXT NOT NULL DEFAULT '',
      origen_fondos TEXT NOT NULL DEFAULT '',
      cc_file_url TEXT NOT NULL DEFAULT '',
      rut_file_url TEXT NOT NULL DEFAULT '',
      camara_comercio_file_url TEXT NOT NULL DEFAULT '',
      cc_representante_file_url TEXT NOT NULL DEFAULT '',
      estados_financieros_file_url TEXT NOT NULL DEFAULT '',
      certificado_bancario_file_url TEXT NOT NULL DEFAULT '',
      composicion_accionaria_file_url TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES kyc_legal_users(id)
    );
  `);

  try {
    db.exec(`ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'editor'`);
  } catch {
    // Column already exists.
  }

  const currentAdminCount = db.prepare('SELECT COUNT(*) AS total FROM admin_users').get() as { total: number };

  if (!currentAdminCount.total) {
    const admin = getBootstrapAdmin();
    const hash = hashSync(admin.password, 10);

    db.prepare('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)').run(admin.username, hash, 'admin');
  } else {
    db.prepare("UPDATE admin_users SET role = 'admin' WHERE id = (SELECT id FROM admin_users ORDER BY id ASC LIMIT 1)").run();
  }

  const legacySagrilaft = db.prepare('SELECT title, description, pdf_url, updated_at FROM sagrilaft_settings WHERE id = 1').get() as
    | { title: string; description: string; pdf_url: string; updated_at: string }
    | undefined;

  const defaults = [
    {
      key: 'sagrilaft',
      title: legacySagrilaft?.title || 'Documento SAGRILAFT',
      description: legacySagrilaft?.description || 'Visualice la version vigente del documento institucional SAGRILAFT.',
      pdfUrl: legacySagrilaft?.pdf_url || DEFAULT_DOCUMENT_URLS.sagrilaft,
      updatedAt: legacySagrilaft?.updated_at || new Date().toISOString(),
    },
    {
      key: 'organigrama',
      title: 'Organigrama Corporativo',
      description: 'Consulte la estructura organizacional actualizada de la empresa.',
      pdfUrl: DEFAULT_DOCUMENT_URLS.organigrama,
      updatedAt: new Date().toISOString(),
    },
    {
      key: 'politica-datos',
      title: 'Politica de Tratamiento de Datos',
      description: 'Documento oficial de politicas de tratamiento y proteccion de datos.',
      pdfUrl: DEFAULT_DOCUMENT_URLS.politicaDatos,
      updatedAt: new Date().toISOString(),
    },
  ];

  const insertDocument = db.prepare(
    `INSERT OR IGNORE INTO compliance_documents (doc_key, title, description, pdf_url, updated_at, updated_by)
     VALUES (?, ?, ?, ?, ?, NULL)`
  );

  for (const item of defaults) {
    insertDocument.run(item.key, item.title, item.description, item.pdfUrl, item.updatedAt);
  }

  // Try to migrate legacy URLs, but never fail app startup if storage is read-only.
  try {
    db.prepare("UPDATE compliance_documents SET pdf_url = ?, updated_at = ? WHERE doc_key = 'sagrilaft' AND pdf_url = ?").run(
      DEFAULT_DOCUMENT_URLS.sagrilaft,
      new Date().toISOString(),
      '/documentos/sagrilaft.pdf'
    );
    db.prepare("UPDATE compliance_documents SET pdf_url = ?, updated_at = ? WHERE doc_key = 'organigrama' AND pdf_url = ?").run(
      DEFAULT_DOCUMENT_URLS.organigrama,
      new Date().toISOString(),
      '/documentos/organigrama.pdf'
    );
    db.prepare("UPDATE compliance_documents SET pdf_url = ?, updated_at = ? WHERE doc_key = 'politica-datos' AND pdf_url = ?").run(
      DEFAULT_DOCUMENT_URLS.politicaDatos,
      new Date().toISOString(),
      '/documentos/politica-datos.pdf'
    );
  } catch {
    // Ignore migration failures to keep runtime healthy.
  }

  const existingSettings = db.prepare('SELECT id FROM sagrilaft_settings WHERE id = 1').get() as { id: number } | undefined;

  if (!existingSettings) {
    db.prepare(
      `INSERT INTO sagrilaft_settings (id, title, description, pdf_url, updated_at)
       VALUES (1, ?, ?, ?, ?)`
    ).run(
      'Documento SAGRILAFT',
      'Visualice la version vigente del documento institucional SAGRILAFT.',
      DEFAULT_DOCUMENT_URLS.sagrilaft,
      new Date().toISOString()
    );
  } else {
    try {
      db.prepare('UPDATE sagrilaft_settings SET pdf_url = ?, updated_at = ? WHERE id = 1 AND pdf_url = ?').run(
        DEFAULT_DOCUMENT_URLS.sagrilaft,
        new Date().toISOString(),
        '/documentos/sagrilaft.pdf'
      );
    } catch {
      // Ignore migration failures to keep runtime healthy.
    }
  }
}

export function getDb(): DbInstance {
  if (globalThis.__vorDb__) {
    return globalThis.__vorDb__;
  }

  const candidates = getDatabaseCandidates();
  const errors: string[] = [];

  for (const dbPath of candidates) {
    try {
      mkdirSync(dirname(dbPath), { recursive: true });

      const db = new Database(dbPath);
      initializeDb(db);

      globalThis.__vorDb__ = db;
      return db;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${dbPath}: ${message}`);
    }
  }

  throw new Error(`Unable to initialize database. Tried: ${errors.join(' | ')}`);
}
