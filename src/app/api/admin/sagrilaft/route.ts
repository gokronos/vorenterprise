import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getSessionUser } from '@/lib/admin-auth';
import { buildAppUrl } from '@/lib/app-url';
import { complianceDocumentKeys, getComplianceDocument, type ComplianceDocumentKey, updateComplianceDocument } from '@/lib/sagrilaft-store';

function safeBaseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'documento';
}

function getFileExt(name: string): string {
  const cleaned = name.trim().toLowerCase();
  const lastDot = cleaned.lastIndexOf('.');
  if (lastDot < 0) {
    return '';
  }

  return cleaned.slice(lastDot + 1);
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.redirect(buildAppUrl(request, '/admin/login?error=auth'), 303);
  }

  const formData = await request.formData();
  const documentKeyRaw = String(formData.get('documentKey') || '').trim() as ComplianceDocumentKey;
  const title = String(formData.get('title') || '');
  const description = String(formData.get('description') || '');
  const pdfUrl = String(formData.get('pdfUrl') || '').trim();
  const fileEntry = formData.get('pdfFile');

  const validKey = complianceDocumentKeys.includes(documentKeyRaw);

  if (!validKey) {
    return NextResponse.redirect(buildAppUrl(request, '/admin?saved=0'), 303);
  }

  const current = await getComplianceDocument(documentKeyRaw);
  let finalPdfUrl = pdfUrl || current.pdfUrl;

  if (fileEntry instanceof File && fileEntry.size > 0) {
    const ext = getFileExt(fileEntry.name);
    const isPdf = fileEntry.type === 'application/pdf' || ext === 'pdf';
    const isImage =
      fileEntry.type === 'image/png' ||
      fileEntry.type === 'image/jpeg' ||
      fileEntry.type === 'image/webp' ||
      ext === 'png' ||
      ext === 'jpg' ||
      ext === 'jpeg' ||
      ext === 'webp';

    const isOrganigrama = documentKeyRaw === 'organigrama';
    const validFileType = isOrganigrama ? isPdf || isImage : isPdf;

    if (!validFileType) {
      return NextResponse.redirect(buildAppUrl(request, '/admin?saved=0&msg=file-type'), 303);
    }

    if (fileEntry.size > 20 * 1024 * 1024) {
      return NextResponse.redirect(buildAppUrl(request, '/admin?saved=0&msg=size'), 303);
    }

    const targetDir = join(process.cwd(), 'public', 'documentos');
    await mkdir(targetDir, { recursive: true });

    const timestamp = Date.now();
    const baseName = safeBaseName(fileEntry.name);
    const finalExt = isPdf ? 'pdf' : ext || 'bin';
    const filename = `${documentKeyRaw}-${baseName}-${timestamp}.${finalExt}`;
    const targetPath = join(targetDir, filename);

    const fileBuffer = Buffer.from(await fileEntry.arrayBuffer());
    await writeFile(targetPath, fileBuffer);

    finalPdfUrl = `/documentos/${filename}`;
  }

  if (!finalPdfUrl.trim()) {
    return NextResponse.redirect(buildAppUrl(request, '/admin?saved=0'), 303);
  }

  await updateComplianceDocument(documentKeyRaw, { title, description, pdfUrl: finalPdfUrl }, user.id);

  return NextResponse.redirect(buildAppUrl(request, '/admin?saved=1'), 303);
}
