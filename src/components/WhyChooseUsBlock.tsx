type WhyItem = {
  title: string;
  shortTitle: string;
  text: string;
  icon: 'security' | 'infrastructure' | 'compliance';
};

const whyItems: WhyItem[] = [
  {
    title: 'SEGURIDAD',
    shortTitle: '"Blindaje Técnico y Legal"',
    text: 'Garantizamos la custodia de su información y activos con la arquitectura de software avanzada, respaldados por un estricto marco normativo que mitiga los riesgos del entorno digital.',
    icon: 'security',
  },
  {
    title: 'INFRAESTRUCTURA',
    shortTitle: '"Plataformas de Ingeniería Avanzada"',
    text: 'Proveemos soluciones de ingeniería transaccional robustas y transparentes, construyendo el entorno digital confiable que el futuro de las finanzas exigen .',
    icon: 'infrastructure',
  },
  {
    title: 'CUMPLIMIENTO',
    shortTitle: '',
    text: 'Nuestra sólida base tecnológica está certificada bajo los altos estándares, asegurando la debida diligencia y transparencia absoluta en cada etapa de su operación.',
    icon: 'compliance',
  },
];

function renderWhyIcon(icon: WhyItem['icon']) {
  if (icon === 'security') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5.6 5.6v5.2c0 4.2 2.7 8 6.4 9.2 3.7-1.2 6.4-5 6.4-9.2V5.6L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <rect x="10" y="10.2" width="4" height="4.8" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.8 10.2v-1a1.2 1.2 0 0 1 2.4 0v1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'infrastructure') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="6" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 18h12M8 18V12l4-2 4 2v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h2m12 0h2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v16H7z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.5 8h5M9.5 11h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12 14.7.9 1.2 1.5-1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhyChooseUsBlock() {
  return (
    <section className="why-final" aria-label="Por que elegirnos">
      <header className="why-final-head">
        <h2>¿Porque Elegir V.O.R ENTERPRISE?</h2>
        <p>
		  Conoce tres razones clave que han permitido ayudar a miles de personas a maximizar sus
		  ganancias
        </p>
      </header>

      <div className="why-final-grid" role="list">
        {whyItems.map((item) => (
          <article key={item.title} className="why-final-card" role="listitem">
            <span className="why-final-icon" aria-hidden="true">
              {renderWhyIcon(item.icon)}
            </span>
            <h3>{item.shortTitle || item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
