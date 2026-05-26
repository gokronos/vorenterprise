import { getDb } from '@/lib/db';

export const complianceDocumentKeys = ['sagrilaft', 'organigrama', 'politica-datos'] as const;

export type ComplianceDocumentKey = (typeof complianceDocumentKeys)[number];

export type ComplianceDocument = {
  key: ComplianceDocumentKey;
  title: string;
  description: string;
  pdfUrl: string;
  updatedAt: string;
  updatedByUsername?: string;
};

const DEFAULT_DOCUMENT_URLS = {
  sagrilaft: '/documentos/sagrilaft-legal-1779506207378.pdf',
  organigrama: '/documentos/organigrama-organigrama-20de7fde-1779505721154.jpg',
  politicaDatos: '/documentos/politica-datos-tratamiento-de-datos-1779506215778.pdf',
} as const;

export async function getComplianceDocument(key: ComplianceDocumentKey): Promise<ComplianceDocument> {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT d.doc_key, d.title, d.description, d.pdf_url, d.updated_at, u.username AS updated_by_username
       FROM compliance_documents d
       LEFT JOIN admin_users u ON u.id = d.updated_by
       WHERE d.doc_key = ?
       LIMIT 1`
    )
    .get(key) as
    | {
        doc_key: ComplianceDocumentKey;
        title: string;
        description: string;
        pdf_url: string;
        updated_at: string;
        updated_by_username?: string;
      }
    | undefined;

  if (!row) {
    const fallbackTitle =
      key === 'sagrilaft'
        ? 'Documento SAGRILAFT'
        : key === 'organigrama'
          ? 'Organigrama Corporativo'
          : 'Politica de Tratamiento de Datos';

    const fallbackDescription =
      key === 'sagrilaft'
        ? 'Visualice la version vigente del documento institucional SAGRILAFT.'
        : key === 'organigrama'
          ? 'Consulte la estructura organizacional actualizada de la empresa.'
          : 'Documento oficial de politicas de tratamiento y proteccion de datos.';

    const fallbackPdf =
      key === 'sagrilaft'
        ? DEFAULT_DOCUMENT_URLS.sagrilaft
        : key === 'organigrama'
          ? DEFAULT_DOCUMENT_URLS.organigrama
          : DEFAULT_DOCUMENT_URLS.politicaDatos;

    return {
      key,
      title: fallbackTitle,
      description: fallbackDescription,
      pdfUrl: fallbackPdf,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    key: row.doc_key,
    title: row.title,
    description: row.description,
    pdfUrl: row.pdf_url,
    updatedAt: row.updated_at,
    updatedByUsername: row.updated_by_username,
  };
}

export async function listComplianceDocuments(): Promise<ComplianceDocument[]> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT d.doc_key, d.title, d.description, d.pdf_url, d.updated_at, u.username AS updated_by_username
       FROM compliance_documents d
       LEFT JOIN admin_users u ON u.id = d.updated_by
       ORDER BY CASE d.doc_key
         WHEN 'sagrilaft' THEN 1
         WHEN 'organigrama' THEN 2
         WHEN 'politica-datos' THEN 3
         ELSE 99
       END ASC`
    )
    .all() as Array<{
    doc_key: ComplianceDocumentKey;
    title: string;
    description: string;
    pdf_url: string;
    updated_at: string;
    updated_by_username?: string;
  }>;

  return rows.map((row) => ({
    key: row.doc_key,
    title: row.title,
    description: row.description,
    pdfUrl: row.pdf_url,
    updatedAt: row.updated_at,
    updatedByUsername: row.updated_by_username,
  }));
}

export async function updateComplianceDocument(
  key: ComplianceDocumentKey,
  nextData: {
  title?: string;
  description?: string;
  pdfUrl?: string;
  },
  updatedBy: number
): Promise<ComplianceDocument> {
  const db = getDb();
  const current = await getComplianceDocument(key);

  const updated: ComplianceDocument = {
    key,
    title: nextData.title?.trim() || current.title,
    description: nextData.description?.trim() || current.description,
    pdfUrl: nextData.pdfUrl?.trim() || current.pdfUrl,
    updatedAt: new Date().toISOString(),
    updatedByUsername: current.updatedByUsername,
  };

  db.prepare(
    `UPDATE compliance_documents
     SET title = ?, description = ?, pdf_url = ?, updated_at = ?, updated_by = ?
     WHERE doc_key = ?`
  ).run(updated.title, updated.description, updated.pdfUrl, updated.updatedAt, updatedBy, key);

  return updated;
}

export async function getSagrilaftConfig(): Promise<ComplianceDocument> {
  return getComplianceDocument('sagrilaft');
}
