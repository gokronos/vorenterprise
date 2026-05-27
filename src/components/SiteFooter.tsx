import { buildAssetUrl } from '../lib/asset-url';

const year = new Date().getFullYear();

const faqLinks = [
  { label: 'Ayuda y Soporte', href: '/preguntas-frecuentes' },
  { label: 'Seguridad Garantizada', href: '/sagrilaft' },
  { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
  { label: 'Politica de Datos', href: '/politica-datos' },
  { label: 'KYC', href: '/kyc' },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.7" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.4 20v-6h2.1l.4-2.7h-2.5V9.6c0-.8.2-1.3 1.4-1.3h1.2V5.9c-.2 0-.9-.1-1.8-.1-1.8 0-3 .9-3 3.2v2.3H9.5V14h1.9v6h2Z" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Pie de pagina">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <section className="site-footer-brand">
            <img
              src={buildAssetUrl('/imagenes/Logo%20VOR.svg')}
              alt="Logo V.O.R. Enterprise"
              className="site-footer-brand-logo"
            />
            <div className="site-footer-brand-copy">
              <h2>V.O.R. ENTERPRISE</h2>
              <p>
                Conectando el presente con el futuro financiero.
                Tu puente hacia la innovacion en activos digitales.
              </p>
            </div>
          </section>

          <nav className="site-footer-nav" aria-label="Preguntas frecuentes">
            <h3>Preguntas Frecuentes</h3>
            <ul>
              {faqLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="site-footer-contact" aria-label="Contacto">
            <h3>Contacto</h3>
            <a href="#contacto">WhatsApp</a>
          </section>
        </div>

        <div className="site-footer-bottom">
          <p>
            Copyright {year} V.O.R. Enterprise S.A.S. Todos los derechos reservados.
            Diseno y desarrollo Imagen Plus AMD.
          </p>
          <div className="site-footer-social" aria-label="Redes sociales">
            <a href="#" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#contacto" aria-label="WhatsApp">
              <span>W</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
