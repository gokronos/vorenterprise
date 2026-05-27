import { buildAssetUrl } from '../lib/asset-url';

type WhyItem = {
  title: string;
  shortTitle: string;
  text: string;
  iconSrc: string;
};

const whyItems: WhyItem[] = [
  {
    title: 'SEGURIDAD',
    shortTitle: '"Blindaje Técnico y Legal"',
    text: 'Garantizamos la custodia de su información y activos con la arquitectura de software avanzada, respaldados por un estricto marco normativo que mitiga los riesgos del entorno digital.',
    iconSrc: '/imagenes/Iconos/Blindaje-T%C3%A9cnico.png',
  },
  {
    title: 'INFRAESTRUCTURA',
    shortTitle: '"Plataformas de Ingeniería Avanzada"',
    text: 'Proveemos soluciones de ingeniería transaccional robustas y transparentes, construyendo el entorno digital confiable que el futuro de las finanzas exigen .',
    iconSrc: '/imagenes/Iconos/infraestructura.png',
  },
  {
    title: 'CUMPLIMIENTO',
    shortTitle: '',
    text: 'Nuestra sólida base tecnológica está certificada bajo los altos estándares, asegurando la debida diligencia y transparencia absoluta en cada etapa de su operación.',
    iconSrc: '/imagenes/Iconos/CUMPLIMIENTO.png',
  },
];

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
              <img src={buildAssetUrl(item.iconSrc)} alt="" />
            </span>
            <h3>{item.shortTitle || item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
