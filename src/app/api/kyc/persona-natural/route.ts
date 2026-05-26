import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { getKycSessionUser } from '@/lib/kyc-auth';
import { getPersonaNaturalProfile, updatePersonaNaturalProfile } from '@/lib/kyc-persona-natural';
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
  const user = await getKycSessionUser();

  if (!user) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Debes+iniciar+sesion'), 303);
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

  if (!nombresCompletos || !numeroIdentificacion || !tipoIdentificacion || !nacionalidad || !ciudad || !direccion || !correoElectronico || !telefonoCelular || !origenFondos) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Completa+todos+los+campos+obligatorios'), 303);
  }

  const current = getPersonaNaturalProfile(user.id);

  const ccFile = formData.get('ccFile');
  const rutFile = formData.get('rutFile');

  let ccFileUrl = current.ccFileUrl;
  let rutFileUrl = current.rutFileUrl;

  if (ccFile instanceof File && ccFile.size > 0) {
    const ext = getFileExt(ccFile.name);
    const valid = ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
    if (!valid) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Archivo+de+cedula+invalido'), 303);
    }
    if (ccFile.size > 15 * 1024 * 1024) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?error=La+cedula+supera+15MB'), 303);
    }
    ccFileUrl = await saveFile(ccFile, 'cc', user.cedula);
  }

  if (!ccFileUrl) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Debes+cargar+la+cedula+por+ambos+lados'), 303);
  }

  if (rutFile instanceof File && rutFile.size > 0) {
    const ext = getFileExt(rutFile.name);
    const valid = ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
    if (!valid) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?error=Archivo+RUT+invalido'), 303);
    }
    if (rutFile.size > 15 * 1024 * 1024) {
      return NextResponse.redirect(buildAppUrl(request, '/kyc?error=El+RUT+supera+15MB'), 303);
    }
    rutFileUrl = await saveFile(rutFile, 'rut', user.cedula);
  }

  updatePersonaNaturalProfile({
    userId: user.id,
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

  return NextResponse.redirect(buildAppUrl(request, '/kyc?saved=profile'), 303);
}
