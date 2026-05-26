type PortfolioIcon = 'gold' | 'stablecoin' | 'contract' | 'shield';

type PortfolioItem = {
  title: string;
  subtitle: string;
  text: string;
  tone: 'gold' | 'cyan';
  icon: PortfolioIcon;
};

const portfolioItems: PortfolioItem[] = [
  {
    title: 'ORO DIGITAL',
    subtitle: 'Tokenizado',
    text: 'Resguardo de valor con enfoque de estabilidad y trazabilidad.',
    tone: 'gold',
    icon: 'gold',
  },
  {
    title: 'DOLAR VIRTUAL',
    subtitle: 'Stablecoins',
    text: 'Liquidez y operaciones de bajo riesgo para entornos de negocio.',
    tone: 'cyan',
    icon: 'stablecoin',
  },
  {
    title: 'CONTRATOS',
    subtitle: 'INTELIGENTES',
    text: 'Automatizacion de procesos con control juridico y tecnico.',
    tone: 'gold',
    icon: 'contract',
  },
  {
    title: 'MONEDA ESTABLE',
    subtitle: 'DIGITAL',
    text: 'Diversificacion de tesoreria en instrumentos digitales estables.',
    tone: 'cyan',
    icon: 'shield',
  },
];

function renderIcon(icon: PortfolioIcon) {
  switch (icon) {
    case 'gold':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v10M8.8 10.2h6.5a2 2 0 0 1 0 4H8.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'stablecoin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="7.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.2 10.2h7.6M8.2 13.8h7.6M12 8.2v7.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'contract':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 4h6l4 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M10 11h4M10 14h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 3 5.6 5.6v5.2c0 4.2 2.7 8 6.4 9.2 3.7-1.2 6.4-5 6.4-9.2V5.6L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="m9.3 12 1.8 1.9 3.7-3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PortfolioBlock() {
  return (
    <section className="portfolio-block" aria-label="Crea tu portafolio de activos virtuales">
      <div className="portfolio-visual">
        <div className="portfolio-visual-head">
          <p className="portfolio-kicker">Arquitectura de valor digital</p>
          <h3>Estructura Profesional de Activos Virtuales</h3>
          <p className="portfolio-intro">
            En <strong>V.O.R. ENTERPRISE S.A.S.</strong> diseniamos y estructuramos portafolios de activos
            virtuales adaptados a sus objetivos.
          </p>
        </div>

        <div className="portfolio-track" role="list">
          {portfolioItems.map((item) => (
            <article key={`${item.title}-${item.subtitle}`} role="listitem" className={`portfolio-card tone-${item.tone}`}>
              <span className="portfolio-icon" aria-hidden="true">
                {renderIcon(item.icon)}
              </span>
              <div>
                <h3>{item.title}</h3>
                <strong>{item.subtitle}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <article className="portfolio-copy">
        <h2>Crea tu portafolio de activos virtuales</h2>
        <p>
          En V.O.R. ENTERPRISE S.A.S. impulsamos la adopción de la economía digital a nivel corporativo y
          personal. Diseñamos y estructuramos portafolios de activos virtuales adaptados a sus objetivos
          financieros, garantizando el más alto estándar de cumplimiento normativo, gestión de riesgos y
          seguridad jurídica en cada etapa.
        </p>
      </article>
    </section>
  );
}