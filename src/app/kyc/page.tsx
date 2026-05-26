import { getKycSessionUser } from '@/lib/kyc-auth';
import { getPersonaNaturalProfile } from '@/lib/kyc-persona-natural';
import { getKycLegalSessionUser } from '@/lib/kyc-legal-auth';
import { getPersonaJuridicaProfile } from '@/lib/kyc-persona-juridica';
import KycSuccessModal from '@/components/KycSuccessModal';
import KycFileViewerButton from '@/components/KycFileViewerButton';

type SearchParams = {
  saved?: string;
  error?: string;
  rol?: string;
  lang?: string;
};

const cityOptions = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Otra'];

export default async function KycPage(props: { searchParams?: Promise<SearchParams> }) {
  const searchParams = (await props.searchParams) || {};
  const rol = (searchParams.rol || 'personas').toLowerCase();
  const isPersonaNatural = rol !== 'juridicos';
  const lang = (searchParams.lang || 'es').toLowerCase() === 'en' ? 'en' : 'es';
  const isEnglish = lang === 'en';
  const savedState = searchParams.saved || '';
  const showSuccessModal = ['registered', 'login', 'profile'].includes(savedState);
  const naturalSessionUser = await getKycSessionUser();
  const legalSessionUser = await getKycLegalSessionUser();
  const sessionUser = isPersonaNatural ? naturalSessionUser : legalSessionUser;
  const profile = isPersonaNatural
    ? naturalSessionUser
      ? getPersonaNaturalProfile(naturalSessionUser.id)
      : null
    : legalSessionUser
      ? getPersonaJuridicaProfile(legalSessionUser.id)
      : null;
  const formProfile = profile || {
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
  };

  const text = {
    kicker: isEnglish ? 'Choose the KYC type you will complete' : 'Elige el tipo de KyC que realizaras',
    roleSwitchLabel: isEnglish ? 'KYC type' : 'Tipo de KYC',
    rolePeople: isEnglish ? '1 Individuals' : '1 Personas',
    roleLegal: isEnglish ? '2 Legal Entities' : '2 Juridicos',
    langSwitchLabel: isEnglish ? 'Language' : 'Idioma',
    spanish: 'ES',
    english: 'EN',
    titlePeople: isEnglish
      ? 'KyC - INDIVIDUAL ONBOARDING - ACTIVOS DIGITALES S.A.S. PSAV'
      : 'KyC - Vinculacion PERSONA NATURAL - ACTIVOS DIGITALES S.A.S. PSAV',
    titleLegal: isEnglish
      ? 'KyC - LEGAL ENTITY ONBOARDING - ACTIVOS DIGITALES S.A.S. PSAV'
      : 'KyC - Vinculacion PERSONA JURIDICA - ACTIVOS DIGITALES S.A.S. PSAV',
    saveOk: isEnglish ? 'Information processed successfully.' : 'Informacion procesada correctamente.',
    sessionActive: isEnglish ? 'Active session with ID:' : 'Sesion activa con identificacion:',
    logout: isEnglish ? 'Sign out' : 'Cerrar sesion',
    firstStepMsg: isEnglish
      ? 'First complete this full form to create your record. Then sign in to edit your information.'
      : 'Primero llena este formulario completo para crear tu registro. Luego inicias sesion para modificar tu informacion.',
    fullName: isEnglish ? 'Full Name' : 'Nombres Completos',
    idNumber: isEnglish ? 'Identification Number' : 'Numero de Identificacion',
    idTypeLabel: isEnglish ? 'Select ID type' : 'Seleccione tipo de identificacion',
    idTypePlaceholder: isEnglish ? 'Select ID type' : 'Seleccione tipo de identificacion',
    idCC: isEnglish ? 'Citizenship ID (CC)' : 'Cedula de Ciudadania (CC)',
    idCE: isEnglish ? 'Foreigner ID (CE)' : 'Cedula de Extranjeria (CE)',
    idPAS: isEnglish ? 'Passport (PAS)' : 'Pasaporte (PAS)',
    nationality: isEnglish ? 'Nationality' : 'Nacionalidad',
    cityLabel: isEnglish ? 'Select a city' : 'Seleccione una ciudad',
    cityPlaceholder: isEnglish ? 'Select a city' : 'Seleccione una ciudad',
    address: isEnglish ? 'Address' : 'Direccion',
    email: isEnglish ? 'Email' : 'Correo Electronico',
    phone: isEnglish ? 'Mobile phone' : 'Telefono celular',
    sourceFunds: isEnglish ? 'Source of funds' : 'Origen de tus fondos',
    ccTitle: 'CC:',
    ccHelp: isEnglish
      ? 'Upload both sides of the ID document, otherwise you will need to repeat the KYC.'
      : 'Cargar la CEDULA DE CIUDADANIA POR AMBOS LADOS, de lo contrario tendra que repetir el KYC.',
    rutTitle: isPersonaNatural
      ? isEnglish
        ? 'RUT: (Optional)'
        : 'RUT: (Opcional)'
      : 'RUT',
    noFile: isEnglish ? 'No file selected' : 'Sin archivos seleccionados',
    chamber: isEnglish ? 'CHAMBER OF COMMERCE' : 'CAMARA DE COMERCIO',
    legalRepCc: isEnglish ? 'LEGAL REPRESENTATIVE ID' : 'CC REPRESENTANTE LEGAL',
    financials: isEnglish ? 'FINANCIAL STATEMENTS' : 'ESTADOS FINANCIEROS',
    bankCert: isEnglish ? 'BANK CERTIFICATE' : 'CERTIFICADO BANCARIO',
    shareholding: isEnglish ? 'SHAREHOLDER COMPOSITION (optional)' : 'COMPOSICION ACCIONARIA (opcional)',
    currentFile: isEnglish ? 'View current file' : 'Ver archivo actual',
    createPassword: isEnglish ? 'Create password' : 'Crear contrasena',
    passPlaceholder: isEnglish ? 'At least 8 characters' : 'Minimo 8 caracteres',
    confirmPassword: isEnglish ? 'Confirm password' : 'Verificar contrasena',
    confirmPassPlaceholder: isEnglish ? 'Repeat your password' : 'Repite la contrasena',
    submit: isEnglish ? 'Submit' : 'Enviar',
    loginTitle: isEnglish ? 'Already registered? Sign in' : 'Ya tienes registro? Inicia sesion',
    loginDesc: isEnglish
      ? 'After initial registration, sign in with your ID number and password to update your data.'
      : 'Despues del registro inicial, entra con tu numero de identificacion y contrasena para modificar tus datos.',
    password: isEnglish ? 'Password' : 'Contrasena',
    loginBtn: isEnglish ? 'Sign in' : 'Ingresar',
  };

  const successModalContent =
    savedState === 'registered'
      ? {
          title: isEnglish
            ? `Successful registration ${isPersonaNatural ? 'Individuals' : 'Legal Entities'}`
            : `Registro exitoso ${isPersonaNatural ? 'Personas' : 'Juridicos'}`,
          message: isEnglish
            ? `Your information was saved successfully in ${isPersonaNatural ? 'Individuals' : 'Legal Entities'}. Now sign in whenever you need to update your data.`
            : `Tu informacion fue guardada correctamente en ${isPersonaNatural ? 'Personas' : 'Juridicos'}. Ahora inicia sesion para modificar tus datos cuando lo necesites.`,
        }
      : savedState === 'login'
        ? {
            title: isEnglish
              ? `Sign-in successful ${isPersonaNatural ? 'Individuals' : 'Legal Entities'}`
              : `Inicio de sesion exitoso ${isPersonaNatural ? 'Personas' : 'Juridicos'}`,
            message: isEnglish
              ? `Welcome to ${isPersonaNatural ? 'Individuals' : 'Legal Entities'}. You can now update your KYC information whenever needed.`
              : `Bienvenido al modulo ${isPersonaNatural ? 'Personas' : 'Juridicos'}. Ya puedes modificar y actualizar tu informacion KYC cuando lo necesites.`,
          }
        : {
            title: isEnglish ? 'Data updated' : 'Datos actualizados',
            message: isEnglish
              ? 'Your KYC form changes were saved successfully.'
              : 'Los cambios de tu formulario KYC se guardaron correctamente.',
          };

  return (
    <main className="home-page">
      <section className="section-shell section-shell-kyc">
        <section className="kyc-modern" aria-label="KYC Persona Natural">
          {showSuccessModal && (
            <KycSuccessModal title={successModalContent.title} message={successModalContent.message} />
          )}

          <header className="kyc-modern-head">
            <p className="kyc-modern-kicker">{text.kicker}</p>
            <div className="kyc-head-controls">
              <div className="kyc-role-switch" role="tablist" aria-label={text.roleSwitchLabel}>
                <a href={`/kyc?rol=personas&lang=${lang}`} className={`kyc-role-chip ${isPersonaNatural ? 'is-active' : ''}`} role="tab" aria-selected={isPersonaNatural}>
                  {text.rolePeople}
                </a>
                <a href={`/kyc?rol=juridicos&lang=${lang}`} className={`kyc-role-chip ${!isPersonaNatural ? 'is-active' : ''}`} role="tab" aria-selected={!isPersonaNatural}>
                  {text.roleLegal}
                </a>
              </div>

              <div className="kyc-lang-switch-wrap" role="group" aria-label={text.langSwitchLabel}>
                <span>{text.langSwitchLabel}</span>
                <div className="kyc-lang-switch">
                  <a
                    href={`/kyc?rol=${isPersonaNatural ? 'personas' : 'juridicos'}&lang=es`}
                    className={`kyc-lang-chip ${!isEnglish ? 'is-active' : ''}`}
                    aria-current={!isEnglish ? 'true' : undefined}
                  >
                    {text.spanish}
                  </a>
                  <a
                    href={`/kyc?rol=${isPersonaNatural ? 'personas' : 'juridicos'}&lang=en`}
                    className={`kyc-lang-chip ${isEnglish ? 'is-active' : ''}`}
                    aria-current={isEnglish ? 'true' : undefined}
                  >
                    {text.english}
                  </a>
                </div>
              </div>
            </div>

            {isPersonaNatural ? (
              <>
                <h1>{text.titlePeople}</h1>
              </>
            ) : (
              <>
                <h1>{text.titleLegal}</h1>
              </>
            )}
          </header>

          {searchParams.error && <p className="kyc-alert kyc-alert-error">{searchParams.error}</p>}
          {searchParams.saved && <p className="kyc-alert kyc-alert-ok">{text.saveOk}</p>}

          <>
              {sessionUser ? (
                <div className="kyc-session-head">
                  <p>
                    {text.sessionActive}{' '}
                    <strong>{isPersonaNatural ? (sessionUser as { cedula: string }).cedula : (sessionUser as { numeroIdentificacion: string }).numeroIdentificacion}</strong>
                  </p>
                  <form action={isPersonaNatural ? '/api/kyc/auth/logout' : '/api/kyc/legal-auth/logout'} method="post">
                    <button type="submit" className="kyc-logout-btn">{text.logout}</button>
                  </form>
                </div>
              ) : (
                <div className="kyc-session-head">
                  <p>{text.firstStepMsg}</p>
                </div>
              )}

              <form
                action={
                  isPersonaNatural
                    ? sessionUser
                      ? '/api/kyc/persona-natural'
                      : '/api/kyc/persona-natural/register'
                    : sessionUser
                      ? '/api/kyc/persona-juridica'
                      : '/api/kyc/persona-juridica/register'
                }
                method="post"
                encType="multipart/form-data"
                className="kyc-modern-form"
              >
                <label>
                  {text.fullName}
                  <input type="text" name="nombresCompletos" defaultValue={formProfile.nombresCompletos} required />
                </label>

                <label>
                  {text.idNumber}
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    defaultValue={
                      formProfile.numeroIdentificacion ||
                      (isPersonaNatural
                        ? ((sessionUser as { cedula?: string } | null)?.cedula || '')
                        : ((sessionUser as { numeroIdentificacion?: string } | null)?.numeroIdentificacion || ''))
                    }
                    required
                  />
                </label>

                <label>
                  {text.idTypeLabel}
                  <select name="tipoIdentificacion" defaultValue={formProfile.tipoIdentificacion || ''} required>
                    <option value="">{text.idTypePlaceholder}</option>
                    <option value="CC">{text.idCC}</option>
                    <option value="CE">{text.idCE}</option>
                    <option value="PAS">{text.idPAS}</option>
                  </select>
                </label>

                <label>
                  {text.nationality}
                  <input type="text" name="nacionalidad" defaultValue={formProfile.nacionalidad} required />
                </label>

                <label>
                  {text.cityLabel}
                  <select name="ciudad" defaultValue={formProfile.ciudad || ''} required>
                    <option value="">{text.cityPlaceholder}</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  {text.address}
                  <input type="text" name="direccion" defaultValue={formProfile.direccion} required />
                </label>

                <label>
                  {text.email}
                  <input type="email" name="correoElectronico" defaultValue={formProfile.correoElectronico} required />
                </label>

                <label>
                  {text.phone}
                  <input type="text" name="telefonoCelular" defaultValue={formProfile.telefonoCelular} required />
                </label>

                <label className="kyc-full">
                  {text.sourceFunds}
                  <textarea name="origenFondos" rows={4} defaultValue={formProfile.origenFondos} required></textarea>
                </label>

                <div className="kyc-full kyc-upload-box">
                  <h3>{text.ccTitle}</h3>
                  <p>{text.ccHelp}</p>
                  <input type="file" name="ccFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                  {formProfile.ccFileUrl ? (
                    <KycFileViewerButton url={formProfile.ccFileUrl} label={text.currentFile} />
                  ) : (
                    <p className="kyc-muted">{text.noFile}</p>
                  )}
                </div>

                <div className="kyc-full kyc-upload-box">
                  <h3>{text.rutTitle}</h3>
                  <input type="file" name="rutFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                  {formProfile.rutFileUrl ? (
                    <KycFileViewerButton url={formProfile.rutFileUrl} label={text.currentFile} />
                  ) : (
                    <p className="kyc-muted">{text.noFile}</p>
                  )}
                </div>

                {!isPersonaNatural && (
                  <>
                    <div className="kyc-full kyc-upload-box">
                      <h3>{text.chamber}</h3>
                      <input type="file" name="camaraComercioFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                      {(formProfile as { camaraComercioFileUrl?: string }).camaraComercioFileUrl ? (
                        <KycFileViewerButton url={(formProfile as { camaraComercioFileUrl: string }).camaraComercioFileUrl} label={text.currentFile} />
                      ) : (
                        <p className="kyc-muted">{text.noFile}</p>
                      )}
                    </div>

                    <div className="kyc-full kyc-upload-box">
                      <h3>{text.legalRepCc}</h3>
                      <p>{text.ccHelp}</p>
                      <input type="file" name="ccRepresentanteFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                      {(formProfile as { ccRepresentanteFileUrl?: string }).ccRepresentanteFileUrl ? (
                        <KycFileViewerButton url={(formProfile as { ccRepresentanteFileUrl: string }).ccRepresentanteFileUrl} label={text.currentFile} />
                      ) : (
                        <p className="kyc-muted">{text.noFile}</p>
                      )}
                    </div>

                    <div className="kyc-full kyc-upload-box">
                      <h3>{text.financials}</h3>
                      <input type="file" name="estadosFinancierosFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                      {(formProfile as { estadosFinancierosFileUrl?: string }).estadosFinancierosFileUrl ? (
                        <KycFileViewerButton url={(formProfile as { estadosFinancierosFileUrl: string }).estadosFinancierosFileUrl} label={text.currentFile} />
                      ) : (
                        <p className="kyc-muted">{text.noFile}</p>
                      )}
                    </div>

                    <div className="kyc-full kyc-upload-box">
                      <h3>{text.bankCert}</h3>
                      <input type="file" name="certificadoBancarioFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                      {(formProfile as { certificadoBancarioFileUrl?: string }).certificadoBancarioFileUrl ? (
                        <KycFileViewerButton url={(formProfile as { certificadoBancarioFileUrl: string }).certificadoBancarioFileUrl} label={text.currentFile} />
                      ) : (
                        <p className="kyc-muted">{text.noFile}</p>
                      )}
                    </div>

                    <div className="kyc-full kyc-upload-box">
                      <h3>{text.shareholding}</h3>
                      <input type="file" name="composicionAccionariaFile" accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp" />
                      {(formProfile as { composicionAccionariaFileUrl?: string }).composicionAccionariaFileUrl ? (
                        <KycFileViewerButton url={(formProfile as { composicionAccionariaFileUrl: string }).composicionAccionariaFileUrl} label={text.currentFile} />
                      ) : (
                        <p className="kyc-muted">{text.noFile}</p>
                      )}
                    </div>
                  </>
                )}

                {!sessionUser && (
                  <>
                    <label>
                      {text.createPassword}
                      <input type="password" name="password" placeholder={text.passPlaceholder} required />
                    </label>

                    <label>
                      {text.confirmPassword}
                      <input type="password" name="confirmPassword" placeholder={text.confirmPassPlaceholder} required />
                    </label>
                  </>
                )}

                <button type="submit">{text.submit}</button>
              </form>

              {!sessionUser && (
                <article className="kyc-auth-card kyc-login-card">
                  <h2>{text.loginTitle}</h2>
                  <p>{text.loginDesc}</p>
                  <form action={isPersonaNatural ? '/api/kyc/auth/login' : '/api/kyc/legal-auth/login'} method="post" className="kyc-auth-form">
                    <label>
                      {text.idNumber}
                      <input type="text" name={isPersonaNatural ? 'cedula' : 'numeroIdentificacion'} required />
                    </label>
                    <label>
                      {text.password}
                      <input type="password" name="password" required />
                    </label>
                    <button type="submit">{text.loginBtn}</button>
                  </form>
                </article>
              )}
          </>
        </section>
      </section>
    </main>
  );
}
