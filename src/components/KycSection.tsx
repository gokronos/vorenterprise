const kycTypes = [
  {
    id: 'persona-natural',
    title: 'KYC Persona Natural',
    description:
      'Validacion para usuarios individuales con control de identidad, origen de fondos y evaluacion de riesgo.',
    details: ['Documento oficial vigente', 'Prueba de residencia', 'Validacion biometrica'],
  },
  {
    id: 'persona-juridica',
    title: 'KYC Persona Juridica',
    description:
      'Proceso para empresas con verificacion societaria, beneficiarios finales y estructura de cumplimiento.',
    details: ['Camara de comercio', 'RUT o equivalente', 'Representacion legal y UBO'],
  },
];

const kycSteps = [
  {
    title: 'Registro Inicial',
    text: 'Selecciona el tipo de KYC y comparte la informacion basica del solicitante.',
  },
  {
    title: 'Carga Segura',
    text: 'Adjunta documentos en un flujo protegido con trazabilidad operativa.',
  },
  {
    title: 'Analisis Normativo',
    text: 'Nuestro equipo de cumplimiento valida identidad, perfil y soportes.',
  },
  {
    title: 'Aprobacion',
    text: 'Recibes confirmacion y habilitacion para iniciar operaciones.',
  },
];

export default function KycSection() {
  return (
    <section className="kyc-modern" aria-label="Proceso KYC">
      <div className="kyc-modern-glow kyc-modern-glow-a" aria-hidden="true"></div>
      <div className="kyc-modern-glow kyc-modern-glow-b" aria-hidden="true"></div>

      <header className="kyc-modern-head">
        <p className="kyc-modern-kicker">Onboarding de Cumplimiento</p>
        <h1>KYC Inteligente y Moderno</h1>
        <p>
          Conectamos validacion normativa con experiencia digital de alto nivel para personas y empresas del ecosistema
          de activos virtuales.
        </p>
      </header>

      <div className="kyc-modern-types" role="list" aria-label="Tipos de KYC disponibles">
        {kycTypes.map((type) => (
          <article key={type.id} className="kyc-type-card" role="listitem">
            <h2>{type.title}</h2>
            <p>{type.description}</p>
            <ul>
              {type.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <a href="/#contacto">Iniciar este KYC</a>
          </article>
        ))}
      </div>

      <section className="kyc-modern-flow" aria-label="Flujo de proceso KYC">
        <h2>Como Funciona</h2>
        <div className="kyc-steps" role="list">
          {kycSteps.map((step, index) => (
            <article key={step.title} className="kyc-step" role="listitem">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kyc-modern-form-wrap" aria-label="Pre registro KYC">
        <h2>Pre-registro KYC</h2>
        <p>Completa esta informacion inicial y nuestro equipo te contacta para continuar el proceso formal.</p>

        <form className="kyc-modern-form" action="/#contacto" method="get">
          <label>
            Nombre completo o razon social
            <input type="text" name="kyc_name" placeholder="Ej. Juan Perez / Empresa XYZ S.A.S." required />
          </label>

          <label>
            Correo corporativo
            <input type="email" name="kyc_email" placeholder="correo@empresa.com" required />
          </label>

          <label>
            Tipo de KYC
            <select name="kyc_type" defaultValue="persona-natural">
              <option value="persona-natural">Persona Natural</option>
              <option value="persona-juridica">Persona Juridica</option>
            </select>
          </label>

          <label>
            Pais
            <input type="text" name="kyc_country" placeholder="Colombia" required />
          </label>

          <label className="kyc-full">
            Comentario inicial
            <textarea
              name="kyc_note"
              rows={4}
              placeholder="Describe brevemente la necesidad de tu proceso KYC"
            ></textarea>
          </label>

          <button type="submit">Continuar con Contacto</button>
        </form>
      </section>
    </section>
  );
}
