import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { getKycLegalSessionUser } from '@/lib/kyc-legal-auth';
import { getPersonaJuridicaProfile, updatePersonaJuridicaProfile } from '@/lib/kyc-persona-juridica';
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

async function saveFile(fileEntry: File, prefix: string, numeroIdentificacion: string): Promise<string> {
  const ext = getFileExt(fileEntry.name);
  const targetDir = join(process.cwd(), 'public', 'kyc-documentos');
  await mkdir(targetDir, { recursive: true });

  const timestamp = Date.now();
  const baseName = safeBaseName(fileEntry.name);
  const finalExt = ext || 'bin';
  const filename = `${prefix}-${numeroIdentificacion}-${baseName}-${timestamp}.${finalExt}`;
  const targetPath = join(targetDir, filename);

  const fileBuffer = Buffer.from(await fileEntry.arrayBuffer());
  await writeFile(targetPath, fileBuffer);

  return `/kyc-documentos/${filename}`;
}

function isValidExt(ext: string): boolean {
  return ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext);
}

async function resolveOptionalFile(
  input: FormDataEntryValue | null,
  prefix: string,
  numeroIdentificacion: string,
  current: string,
  required: boolean
): Promise<string> {
  if (!(input instanceof File) || input.size === 0) {
    if (required && !current) {
      throw new Error(`${prefix}:required`);
    }
    return current;
  }

  const ext = getFileExt(input.name);
  if (!isValidExt(ext)) {
    throw new Error(`${prefix}:invalid`);
  }

  if (input.size > 15 * 1024 * 1024) {
    throw new Error(`${prefix}:size`);
  }

  return saveFile(input, prefix, numeroIdentificacion);
}

function mapFileError(error: unknown): string {
  const code = error instanceof Error ? error.message : 'unknown';

  if (code.endsWith(':required')) {
    if (code.startsWith('cc-representante')) return 'Debes+cargar+la+CC+del+representante+legal';
    if (code.startsWith('cc')) return 'Debes+cargar+la+cedula+por+ambos+lados';
    if (code.startsWith('camara-comercio')) return 'Debes+cargar+la+camara+de+comercio';
    if (code.startsWith('estados-financieros')) return 'Debes+cargar+estados+financieros';
    if (code.startsWith('certificado-bancario')) return 'Debes+cargar+el+certificado+bancario';
    if (code.startsWith('rut')) return 'Debes+cargar+el+RUT';
  }

  if (code.endsWith(':invalid')) return 'Uno+de+los+archivos+tiene+formato+invalido';
  if (code.endsWith(':size')) return 'Uno+de+los+archivos+supera+15MB';

  return 'Error+al+cargar+archivos';
}

export async function POST(request: Request) {
  const user = await getKycLegalSessionUser();

  if (!user) {
    return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=juridicos&error=Debes+iniciar+sesion'), 303);
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
    return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=juridicos&error=Completa+todos+los+campos+obligatorios'), 303);
  }

  const current = getPersonaJuridicaProfile(user.id);

  let ccFileUrl = current.ccFileUrl;
  let rutFileUrl = current.rutFileUrl;
  let camaraComercioFileUrl = current.camaraComercioFileUrl;
  let ccRepresentanteFileUrl = current.ccRepresentanteFileUrl;
  let estadosFinancierosFileUrl = current.estadosFinancierosFileUrl;
  let certificadoBancarioFileUrl = current.certificadoBancarioFileUrl;
  let composicionAccionariaFileUrl = current.composicionAccionariaFileUrl;

  try {
    ccFileUrl = await resolveOptionalFile(formData.get('ccFile'), 'cc', user.numeroIdentificacion, ccFileUrl, true);
    rutFileUrl = await resolveOptionalFile(formData.get('rutFile'), 'rut', user.numeroIdentificacion, rutFileUrl, true);
    camaraComercioFileUrl = await resolveOptionalFile(formData.get('camaraComercioFile'), 'camara-comercio', user.numeroIdentificacion, camaraComercioFileUrl, true);
    ccRepresentanteFileUrl = await resolveOptionalFile(formData.get('ccRepresentanteFile'), 'cc-representante', user.numeroIdentificacion, ccRepresentanteFileUrl, true);
    estadosFinancierosFileUrl = await resolveOptionalFile(formData.get('estadosFinancierosFile'), 'estados-financieros', user.numeroIdentificacion, estadosFinancierosFileUrl, true);
    certificadoBancarioFileUrl = await resolveOptionalFile(formData.get('certificadoBancarioFile'), 'certificado-bancario', user.numeroIdentificacion, certificadoBancarioFileUrl, true);
    composicionAccionariaFileUrl = await resolveOptionalFile(formData.get('composicionAccionariaFile'), 'composicion-accionaria', user.numeroIdentificacion, composicionAccionariaFileUrl, false);
  } catch (error) {
    return NextResponse.redirect(buildAppUrl(request, `/kyc?rol=juridicos&error=${mapFileError(error)}`), 303);
  }

  updatePersonaJuridicaProfile({
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
    camaraComercioFileUrl,
    ccRepresentanteFileUrl,
    estadosFinancierosFileUrl,
    certificadoBancarioFileUrl,
    composicionAccionariaFileUrl,
  });

  return NextResponse.redirect(buildAppUrl(request, '/kyc?rol=juridicos&saved=profile'), 303);
}
