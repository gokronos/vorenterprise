import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { registerKycUser } from '@/lib/kyc-auth';
import { updatePersonaNaturalProfile } from '@/lib/kyc-persona-natural';
import { isRateLimited } from '@/lib/rate-limit';
import { buildAppUrl } from '@/lib/app-url';

function safeBaseName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'documento'
  );
}

function getFileExt(name: string): string {
  const cleaned = name.trim().toLowerCase();
  const lastDot = cleaned.lastIndexOf('.');
  if (lastDot < 0) {
    return '';
  }

  return cleaned.slice(lastDot + 1);
}

async function saveFile(fileEntry: File, prefix: string, cedula: string): Promise<string> {
  const ext = getFileExt(fileEntry.name);
  const targetDir = join(process.cwd(), 'public', 'kyc-documentos');
  await mkdir(targetDir, { recursive: true });

  const timestamp = Date.now();
  const baseName = safeBaseName(fileEntry.name);
  const finalExt = ext || 'bin';
  const filename = `${prefix}-${cedula}-${baseName}-${timestamp}.${finalExt}`;
  const targetPath = join(targetDir, filename);

  const fileBuffer = Buffer.from(await fileEntry.arrayBuffer());
  await writeFile(targetPath, fileBuffer);

  return `/kyc-documentos/${filename}`;
}

export async function POST(request: Request) {
  const limit = await isRateLimited({ request, scope: 'kyc-natural-register-full', max: 5, windowMs: 15 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=Demasiados+intentos+de+registro.+Intenta+mas+tarde'), 303);
  }

  const formData = await request.formData();

  const nombresCompletos = String(formData.get('nombresCompletos') || '').trim();
  const numeroIdentificacion = String(formData.get('numeroIdentificacion') || '').trim();
  const tipoIdentificacion = String(formData.get('tipoIdentificacion') || '').trim();
  const nacionalidad = String(formData.get('nacionalidad') || '').trim();
  const ciudad = String(formData.get('ciudad') || '').trim();
  const direccion = String(formData.get('direccion') || '').trim();
  const correoElectronico = String(formData.get('correoElectronico') || '').trim();
  const telefonoCelular = String(formData.get('telefonoCelular') || '').trim();
  const origenFondos = String(formData.get('origenFondos') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!nombresCompletos || !numeroIdentificacion || !tipoIdentificacion || !nacionalidad || !ciudad || !direccion || !correoElectronico || !telefonoCelular || !origenFondos) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=Completa+todos+los+campos+obligatorios'), 303);
  }

  const ccFile = formData.get('ccFile');
  const rutFile = formData.get('rutFile');

  let ccFileUrl = '';
  let rutFileUrl = '';

  if (ccFile instanceof File && ccFile.size > 0) {
    const ext = getFileExt(ccFile.name);
    const valid = ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
    if (!valid) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=Archivo+de+cedula+invalido'), 303);
    }
    if (ccFile.size > 15 * 1024 * 1024) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=La+cedula+supera+15MB'), 303);
    }

    ccFileUrl = await saveFile(ccFile, 'cc', numeroIdentificacion);
  }

  if (!ccFileUrl) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=Debes+cargar+la+cedula+por+ambos+lados'), 303);
  }

  if (rutFile instanceof File && rutFile.size > 0) {
    const ext = getFileExt(rutFile.name);
    const valid = ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
    if (!valid) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=Archivo+RUT+invalido'), 303);
    }
    if (rutFile.size > 15 * 1024 * 1024) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&error=El+RUT+supera+15MB'), 303);
    }

    rutFileUrl = await saveFile(rutFile, 'rut', numeroIdentificacion);
  }

  const register = registerKycUser({ cedula: numeroIdentificacion, password, confirmPassword });

  if (!register.ok || !register.user) {
    return NextResponse.redirect(buildAppUrl(request, `/kyc?rol=personas&error=${encodeURIComponent(register.message)}`), 303);
  }

  updatePersonaNaturalProfile({
    userId: register.user.id,
    nombresCompletos,
    numeroIdentificacion,
    tipoIdentificacion,
    nacionalidad,
    ciudad,
    direccion,
    correoElectronico,
    telefonoCelular,
    origenFondos,
    ccFileUrl,
    rutFileUrl,
  });

  return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=personas&saved=registered'), 303);
}
