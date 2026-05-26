import { getDb } from '@/lib/db';

export type PersonaJuridicaProfile = {
  userId: number;
  nombresCompletos: string;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  nacionalidad: string;
  ciudad: string;
  direccion: string;
  correoElectronico: string;
  telefonoCelular: string;
  origenFondos: string;
  ccFileUrl: string;
  rutFileUrl: string;
  camaraComercioFileUrl: string;
  ccRepresentanteFileUrl: string;
  estadosFinancierosFileUrl: string;
  certificadoBancarioFileUrl: string;
  composicionAccionariaFileUrl: string;
  updatedAt: string;
};

export function getPersonaJuridicaProfile(userId: number): PersonaJuridicaProfile {
  const db = getDb();

  db.prepare('INSERT OR IGNORE INTO kyc_legal_profiles (user_id, updated_at) VALUES (?, datetime(\'now\'))').run(userId);

  const row = db
    .prepare(
      `SELECT
        user_id,
        nombres_completos,
        numero_identificacion,
        tipo_identificacion,
        nacionalidad,
        ciudad,
        direccion,
        correo_electronico,
        telefono_celular,
        origen_fondos,
        cc_file_url,
        rut_file_url,
        camara_comercio_file_url,
        cc_representante_file_url,
        estados_financieros_file_url,
        certificado_bancario_file_url,
        composicion_accionaria_file_url,
        updated_at
      FROM kyc_legal_profiles
      WHERE user_id = ?
      LIMIT 1`
    )
    .get(userId) as
    | {
        user_id: number;
        nombres_completos: string;
        numero_identificacion: string;
        tipo_identificacion: string;
        nacionalidad: string;
        ciudad: string;
        direccion: string;
        correo_electronico: string;
        telefono_celular: string;
        origen_fondos: string;
        cc_file_url: string;
        rut_file_url: string;
        camara_comercio_file_url: string;
        cc_representante_file_url: string;
        estados_financieros_file_url: string;
        certificado_bancario_file_url: string;
        composicion_accionaria_file_url: string;
        updated_at: string;
      }
    | undefined;

  if (!row) {
    return {
      userId,
      nombresCompletos: '',
      numeroIdentificacion: '',
      tipoIdentificacion: '',
      nacionalidad: '',
      ciudad: '',
      direccion: '',
      correoElectronico: '',
      telefonoCelular: '',
      origenFondos: '',
      ccFileUrl: '',
      rutFileUrl: '',
      camaraComercioFileUrl: '',
      ccRepresentanteFileUrl: '',
      estadosFinancierosFileUrl: '',
      certificadoBancarioFileUrl: '',
      composicionAccionariaFileUrl: '',
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    userId: row.user_id,
    nombresCompletos: row.nombres_completos,
    numeroIdentificacion: row.numero_identificacion,
    tipoIdentificacion: row.tipo_identificacion,
    nacionalidad: row.nacionalidad,
    ciudad: row.ciudad,
    direccion: row.direccion,
    correoElectronico: row.correo_electronico,
    telefonoCelular: row.telefono_celular,
    origenFondos: row.origen_fondos,
    ccFileUrl: row.cc_file_url,
    rutFileUrl: row.rut_file_url,
    camaraComercioFileUrl: row.camara_comercio_file_url,
    ccRepresentanteFileUrl: row.cc_representante_file_url,
    estadosFinancierosFileUrl: row.estados_financieros_file_url,
    certificadoBancarioFileUrl: row.certificado_bancario_file_url,
    composicionAccionariaFileUrl: row.composicion_accionaria_file_url,
    updatedAt: row.updated_at,
  };
}

export function updatePersonaJuridicaProfile(input: {
  userId: number;
  nombresCompletos: string;
  numeroIdentificacion: string;
  tipoIdentificacion: string;
  nacionalidad: string;
  ciudad: string;
  direccion: string;
  correoElectronico: string;
  telefonoCelular: string;
  origenFondos: string;
  ccFileUrl?: string;
  rutFileUrl?: string;
  camaraComercioFileUrl?: string;
  ccRepresentanteFileUrl?: string;
  estadosFinancierosFileUrl?: string;
  certificadoBancarioFileUrl?: string;
  composicionAccionariaFileUrl?: string;
}): void {
  const db = getDb();
  const current = getPersonaJuridicaProfile(input.userId);

  db.prepare(
    `UPDATE kyc_legal_profiles
     SET
       nombres_completos = ?,
       numero_identificacion = ?,
       tipo_identificacion = ?,
       nacionalidad = ?,
       ciudad = ?,
       direccion = ?,
       correo_electronico = ?,
       telefono_celular = ?,
       origen_fondos = ?,
       cc_file_url = ?,
       rut_file_url = ?,
       camara_comercio_file_url = ?,
       cc_representante_file_url = ?,
       estados_financieros_file_url = ?,
       certificado_bancario_file_url = ?,
       composicion_accionaria_file_url = ?,
       updated_at = datetime('now')
     WHERE user_id = ?`
  ).run(
    input.nombresCompletos,
    input.numeroIdentificacion,
    input.tipoIdentificacion,
    input.nacionalidad,
    input.ciudad,
    input.direccion,
    input.correoElectronico,
    input.telefonoCelular,
    input.origenFondos,
    input.ccFileUrl ?? current.ccFileUrl,
    input.rutFileUrl ?? current.rutFileUrl,
    input.camaraComercioFileUrl ?? current.camaraComercioFileUrl,
    input.ccRepresentanteFileUrl ?? current.ccRepresentanteFileUrl,
    input.estadosFinancierosFileUrl ?? current.estadosFinancierosFileUrl,
    input.certificadoBancarioFileUrl ?? current.certificadoBancarioFileUrl,
    input.composicionAccionariaFileUrl ?? current.composicionAccionariaFileUrl,
    input.userId
  );
}
