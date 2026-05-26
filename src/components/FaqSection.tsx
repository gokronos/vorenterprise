const faqItems = [
  {
    id: 'faq-1',
    question: 'Que tipo de soluciones ofrece V.O.R. ENTERPRISE S.A.S.?',
    answer:
      'Desarrollamos infraestructura tecnologica y arquitectura de software avanzada para el ecosistema de activos virtuales. Nuestra firma provee el entorno tecnico necesario para que empresas y aliados integren y conecten soluciones financieras globales de forma eficiente y bajo entornos robustos.',
  },
  {
    id: 'faq-2',
    question: 'Como funciona la implementacion de sus soluciones tecnologicas?',
    answer:
      'Nuestro servicio opera en fases corporativas estrictas para garantizar trazabilidad tecnica y normativo-operativa.',
    bullets: [
      {
        title: 'Validacion y Cumplimiento',
        text: 'Estructuracion del marco legal y debida diligencia junto a nuestro Oficial de Cumplimiento.',
      },
      {
        title: 'Diseno de Arquitectura',
        text: 'Desarrollo y adaptacion del software segun los objetivos institucionales del aliado.',
      },
      {
        title: 'Seguridad Transaccional',
        text: 'Implementacion de protocolos verificados, contratos inteligentes y auditorias de codigo para mitigar riesgos en el entorno digital.',
      },
    ],
  },
  {
    id: 'faq-3',
    question: 'Que tipo de activos virtuales se contemplan en sus disenos de infraestructura?',
    answer:
      'Disenamos y estructuramos soluciones basadas en activos virtuales de valor estable y alta liquidez. Esto incluye la ingenieria para la gestion de oro digital tokenizado, monedas estables (stablecoins vinculadas al dolar o multi-divisa) y la automatizacion de procesos mediante contratos inteligentes (smart contracts).',
  },
  {
    id: 'faq-4',
    question: 'Cuales son los requisitos para iniciar una estructuracion corporativa con V.O.R.?',
    answer:
      'Al estar comprometidos con un estricto marco normativo y de prevencion de riesgos, el inicio de cualquier proyecto requiere el proceso de vinculacion institucional. Esto incluye la verificacion de identidad corporativa o personal (documentacion oficial), el analisis de cumplimiento interno y la alineacion con los estandares normativos vigentes.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="faq-section" aria-label="Preguntas frecuentes">
      <div className="faq-glow faq-glow-a" aria-hidden="true"></div>
      <div className="faq-glow faq-glow-b" aria-hidden="true"></div>

      <div className="faq-head">
        <p className="faq-kicker">Centro de respuestas</p>
        <h2>Preguntas Frecuentes</h2>
        <p>
          Marco informativo corporativo para aliados e instituciones que evaluan una estructuracion tecnologica con
          V.O.R. ENTERPRISE S.A.S.
        </p>
        <div className="faq-head-tags" aria-label="Puntos clave">
          <span>Infraestructura</span>
          <span>Cumplimiento</span>
          <span>Seguridad</span>
        </div>
      </div>

      <div className="faq-layout">
        <article className="faq-highlight">
          <h3>Enfoque Corporativo Estatico</h3>
          <p>
            Cada respuesta esta redactada para procesos de evaluacion institucional, compliance y toma de decisiones
            en infraestructura de activos virtuales.
          </p>
          <ul>
            <li>Arquitectura de software avanzada</li>
            <li>Cumplimiento y debida diligencia</li>
            <li>Seguridad transaccional verificable</li>
          </ul>
        </article>

        <div className="faq-accordion" role="list">
          {faqItems.map((item, index) => (
            <details key={item.id} className="faq-item" role="listitem" open={index === 0}>
              <summary>
                <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-question">{item.question}</span>
                <span className="faq-plus" aria-hidden="true"></span>
              </summary>

              <div className="faq-answer">
                <p>{item.answer}</p>

                {item.bullets && (
                  <ul className="faq-bullets">
                    {item.bullets.map((bullet) => (
                      <li key={bullet.title}>
                        <strong>{bullet.title}:</strong> {bullet.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="faq-cta-strip">
        <p>Quieres avanzar a una evaluacion tecnica y normativa con nuestro equipo?</p>
        <a href="/#contacto" className="faq-cta-link" aria-label="Ir a contacto">
          Ir a Contacto
        </a>
      </div>
    </section>
  );
}
