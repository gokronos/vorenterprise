'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Sagrilaft', href: '/sagrilaft' },
  { label: 'Organigrama', href: '/organigrama' },
  { label: 'Política de Datos', href: '/politica-datos' },
  { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
  { label: 'KYC', href: '/kyc' },
];

export default function MainMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isMenuItemActive = (itemHref: string): boolean => {
    return pathname === itemHref;
  };

  return (
    <header className="main-menu">
      <div className="menu-brand">
        <img
          src="/imagenes/Logo%20VOR.svg"
          alt="Logo V.O.R. Enterprise"
          className="menu-brand-logo"
        />
        <div className="menu-brand-text">
          <strong>V.O.R.</strong>
          <span>Enterprise S.A.S.</span>
        </div>
      </div>

      <button
        type="button"
        className={`menu-toggle ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir o cerrar menu"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`menu-nav ${isOpen ? 'is-open' : ''}`} aria-label="Menu principal">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`menu-link ${isMenuItemActive(item.href) ? 'is-active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
            {isMenuItemActive(item.href) && (
              <span className="menu-link-underline" aria-hidden="true"></span>
            )}
          </Link>
        ))}

        <a href="/#contacto" className="menu-cta menu-cta-mobile" onClick={() => setIsOpen(false)} aria-label="Contactanos">
          <span className="menu-cta-label">CONTACTANOS</span>
          <svg aria-hidden="true" className="menu-cta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.49 2 2 6.49 2 12c0 2.05.62 3.96 1.69 5.54L2.5 21.5l4.07-1.14A9.93 9.93 0 0 0 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2Zm0 18a7.95 7.95 0 0 1-4.08-1.12l-.29-.17-2.42.68.66-2.36-.18-.3A7.96 7.96 0 1 1 12 20Zm4.31-5.54c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.22-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.26.36-.39.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.29-.74-1.76-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.39.51.58.18 1.11.15 1.53.09.47-.07 1.44-.59 1.64-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28Z" fill="#021338"/>
          </svg>
        </a>
      </nav>

      <div className="menu-cta-wrap">
        <a href="/#contacto" className="menu-cta" aria-label="Contactanos">
          <span className="menu-cta-label">CONTACTANOS</span>
          <svg aria-hidden="true" className="menu-cta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.49 2 2 6.49 2 12c0 2.05.62 3.96 1.69 5.54L2.5 21.5l4.07-1.14A9.93 9.93 0 0 0 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2Zm0 18a7.95 7.95 0 0 1-4.08-1.12l-.29-.17-2.42.68.66-2.36-.18-.3A7.96 7.96 0 1 1 12 20Zm4.31-5.54c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.22-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.26.36-.39.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.29-.74-1.76-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.39.51.58.18 1.11.15 1.53.09.47-.07 1.44-.59 1.64-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28Z" fill="#021338"/>
          </svg>
        </a>
      </div>
    </header>
  );
}
