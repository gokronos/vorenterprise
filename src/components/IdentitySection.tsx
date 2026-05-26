'use client';

import { useMemo, useState } from 'react';

type IdentityKey = 'mision' | 'vision' | 'ceo';

type IdentityItem = {
  key: IdentityKey;
  title: string;
  short: string;
  icon: 'mision' | 'vision' | 'ceo';
  content: string;
};

const items: IdentityItem[] = [
  {
    key: 'mision',
    title: 'Mision Institucional',
    short: 'Infraestructura tecnologica y arquitectura de software de vanguardia.',
    icon: 'mision',
    content:
      'Desarrollar soluciones de infraestructura tecnologica y arquitectura de software de vanguardia que impulsen la transformacion y optimizacion de plataformas transaccionales. Nos comprometemos a mitigar los riesgos del entorno digital mediante la innovacion tecnica continua y la implementacion de controles normativos estrictos, brindando confianza y solidez a nuestros aliados y clientes.',
  },
  {
    key: 'vision',
    title: 'Vision Estrategica',
    short: 'Firma lider en software, resguardo de informacion e infraestructura especializada.',
    icon: 'vision',
    content:
      'Consolidarnos como la firma lider en soluciones de software, resguardo de informacion e infraestructura tecnologica especializada a nivel nacional e internacional. Buscamos ser el referente absoluto en seguridad informatica, ingenieria avanzada y cumplimiento legal, facilitando la convergencia de tecnologias emergentes bajo los mas altos estandares corporativos globales.',
  },
  {
    key: 'ceo',
    title: 'CEO y Fundador',
    short: 'Liderazgo empresarial con enfoque en influencia digital y vision estrategica.',
    icon: 'ceo',
    content:
      'Detras del exito: un vistazo al mundo empresarial donde la influencia en redes sociales se combina con liderazgo. Con una base de seguidores que supera los 100,000, Norman ha consolidado su posicion como referente en plataformas digitales. Como empresario, dirige una empresa prospera que refleja su vision y creatividad.',
  },
];

export default function IdentitySection() {
  const [active, setActive] = useState<IdentityKey | null>(null);

  const selected = useMemo(() => items.find((item) => item.key === active) ?? null, [active]);

  const renderIcon = (kind: IdentityItem['icon']) => {
    if (kind === 'mision') {
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5.3 3.5 8.9 8 10 4.5-1.1 8-4.7 8-10V7l-8-4Z" stroke="currentColor" strokeWidth="1.8"/>
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }

    if (kind === 'vision') {
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 20c.8-3.4 3.3-5 7-5s6.2 1.6 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  };

  return (
    <section className="identity" aria-label="Nuestra identidad">
      <div className="identity-header">
        <h2>Nuestra Identidad</h2>
      </div>

      <div className="identity-grid">
        {items.map((item) => (
          <button type="button" key={item.key} className="identity-card" onClick={() => setActive(item.key)}>
            <span className="identity-icon" aria-hidden="true">
              {renderIcon(item.icon)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.short}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="identity-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setActive(null)}
        >
          <div className="identity-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="identity-close" onClick={() => setActive(null)} aria-label="Cerrar ventana">
              x
            </button>
            <h3>{selected.title}</h3>
            <p>{selected.content}</p>
          </div>
        </div>
      )}
    </section>
  );
}