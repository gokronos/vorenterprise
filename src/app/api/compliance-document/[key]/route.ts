import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { getComplianceDocument, type ComplianceDocumentKey } from '@/lib/sagrilaft-store';

type RouteContext = {
  params: Promise<{ key: string }>;
};

function isComplianceKey(value: string): value is ComplianceDocumentKey {
  return value === 'sagrilaft' || value === 'organigrama' || value === 'politica-datos';
}

function getContentType(filePathOrUrl: string, fallback?: string): string {
  const normalized = filePathOrUrl.toLowerCase().split('?')[0];
  if (normalized.endsWith('.pdf')) return 'application/pdf';
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
  if (normalized.endsWith('.webp')) return 'image/webp';
  return fallback ?? 'application/octet-stream';
}

function getSafeFilename(filePathOrUrl: string): string {
  try {
    const parsed = new URL(filePathOrUrl, 'http://local');
    const base = path.basename(parsed.pathname);
    return base || 'documento';
  } catch {
    return 'documento';
  }
}

async function resolveFallbackAssetPath(key: ComplianceDocumentKey, publicRoot: string): Promise<string | null> {
  const documentosDir = path.join(publicRoot, 'documentos');

  let entries: string[] = [];
  try {
    entries = await fs.readdir(documentosDir);
  } catch {
    return null;
  }

  const normalizedEntries = entries.map((name) => name.toLowerCase());

  const findByNeedle = (needles: string[], allowedExt: string[]): string | null => {
    for (let i = 0; i < normalizedEntries.length; i += 1) {
      const item = normalizedEntries[i];
      const original = entries[i];
      const hasNeedle = needles.some((needle) => item.includes(needle));
      const hasExt = allowedExt.some((ext) => item.endsWith(ext));
      if (hasNeedle && hasExt) {
        return path.join(documentosDir, original);
      }
    }
    return null;
  };

  if (key === 'sagrilaft') {
    return findByNeedle(['sagrilaft'], ['.pdf']);
  }

  if (key === 'organigrama') {
    return findByNeedle(['organigrama'], ['.pdf', '.jpg', '.jpeg', '.png', '.webp']);
  }

  return findByNeedle(['politica-datos', 'tratamiento-de-datos'], ['.pdf']);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { key } = await context.params;

  if (!isComplianceKey(key)) {
    return NextResponse.json({ error: 'Documento no valido' }, { status: 404 });
  }

  const mode = request.nextUrl.searchParams.get('mode') === 'download' ? 'download' : 'view';
  const config = await getComplianceDocument(key);
  const sourceUrl = config.pdfUrl;

  const contentDispositionType = mode === 'download' ? 'attachment' : 'inline';

  if (sourceUrl.startsWith('/')) {
    const publicRoot = path.resolve(process.cwd(), 'public');
    const requestedPath = new URL(sourceUrl, 'http://local').pathname;
    let targetPath = path.resolve(publicRoot, `.${requestedPath}`);

    if (!targetPath.startsWith(publicRoot)) {
      return NextResponse.json({ error: 'Ruta invalida' }, { status: 400 });
    }

    try {
      await fs.access(targetPath);
    } catch {
      const fallbackPath = await resolveFallbackAssetPath(key, publicRoot);
      if (!fallbackPath) {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }
      targetPath = fallbackPath;
    }

    try {
      const data = await fs.readFile(targetPath);
      const contentType = getContentType(targetPath);
      const filename = path.basename(targetPath);

      return new NextResponse(data, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `${contentDispositionType}; filename="${filename}"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }
  }

  try {
    const upstream = await fetch(sourceUrl, { cache: 'no-store' });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'No se pudo obtener el documento remoto' }, { status: 502 });
    }

    const bytes = await upstream.arrayBuffer();
    const fallbackType = upstream.headers.get('content-type') ?? undefined;
    const contentType = getContentType(sourceUrl, fallbackType);
    const filename = getSafeFilename(sourceUrl);

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${contentDispositionType}; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error consultando el documento remoto' }, { status: 502 });
  }
}
