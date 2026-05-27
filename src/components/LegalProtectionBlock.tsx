"use client";

import { useState } from 'react';
import { buildAssetUrl } from '../lib/asset-url';

export default function LegalProtectionBlock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="legal-block" aria-label="Proteccion juridica en activos virtuales">
        <figure className="legal-visual" aria-hidden="true">
          <svg viewBox="0 0 460 460" role="img">
            <defs>
              <linearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#00D4E6" />
                <stop offset="100%" stopColor="#0088BB" />
              </linearGradient>
              <linearGradient id="lockGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(0,240,255,0.75)" />
                <stop offset="100%" stopColor="rgba(0,136,187,0.35)" />
              </linearGradient>
              <filter id="blurGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            <path d="M230 62c-68 0-124 56-124 124v60h42v-60c0-45 37-82 82-82s82 37 82 82v60h42v-60c0-68-56-124-124-124Z" fill="none" stroke="url(#lockBody)" strokeWidth="26" />
            <rect x="88" y="214" width="284" height="192" rx="42" fill="rgba(4,8,20,0.72)" stroke="url(#lockBody)" strokeWidth="14" />
            <rect x="88" y="214" width="284" height="192" rx="42" fill="url(#lockGlow)" opacity="0.15" filter="url(#blurGlow)" />
            <path d="M174 250h112M174 282h112M174 314h84M284 314h22" stroke="url(#lockBody)" strokeOpacity="0.62" strokeWidth="6" strokeLinecap="round" />
            <path d="M230 284c-20 0-36 16-36 36 0 12 6 23 16 30v30h40v-30c10-7 16-18 16-30 0-20-16-36-36-36Z" fill="none" stroke="url(#lockBody)" strokeWidth="11" strokeLinejoin="round" />
            <path d="M230 297v24" stroke="url(#lockBody)" strokeWidth="10" strokeLinecap="round" />
            <circle cx="124" cy="334" r="4" fill="#00F0FF" />
            <circle cx="154" cy="354" r="3.5" fill="#00F0FF" />
            <circle cx="320" cy="260" r="4" fill="#00F0FF" />
            <circle cx="336" cy="292" r="3.5" fill="#00F0FF" />
            <circle cx="284" cy="348" r="3.5" fill="#00F0FF" />
          </svg>
        </figure>

        <article className="legal-copy">
          <h2>Proteccion Juridica en Cada Operacion de Activos Virtuales</h2>
          <p>
            Cumplimos con las normativas SAGRILAFT para asegurar la integridad y seguridad de tus
            transacciones de activos virtuales. Protegemos tu inversion con los mas altos estandares
            de seguridad del sector.
          </p>
          <button type="button" className="legal-cta" onClick={() => setOpen(true)}>
            Leer Normativa Legal
          </button>
        </article>
      </section>

      {open ? (
        <div className="legal-modal-backdrop" onClick={() => setOpen(false)} role="presentation">
          <article
            className="legal-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Compromiso SAGRILAFT"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="legal-close" onClick={() => setOpen(false)} aria-label="Cerrar ventana legal">
              x
            </button>

            <div className="legal-modal-head">
              <div className="uiaf-seal" aria-hidden="true">
                <img src={buildAssetUrl('/imagenes/sagrilaft.698ee715.png')} alt="Sello UIAF" className="uiaf-seal-image" />
              </div>

              <div>
                <h3>Compromiso SAGRILAFT</h3>
                <p>
                  En la Organizacion ACTIVOS DIGITALES S.A.S. estamos comprometidos con acciones que
                  permitan tener operaciones comerciales de venta, compra, intermediacion y custodia
                  de activos virtuales, disminuyendo los riesgos frente al lavado de activos y la
                  financiacion del terrorismo.
                </p>
              </div>
            </div>

            <div className="legal-modal-body">
              <p>
                Esta necesidad responde a que en Colombia es necesario establecer procedimientos,
                controles y reportes en personas naturales o juridicas que realicen actividades
                comerciales con activos virtuales para la prevencion de actividades delictivas.
              </p>
              <p>
                Ante la amenaza de la delincuencia internacional en cualquiera de sus expresiones,
                cada vez son mas los entes obligados a adoptar medidas de prevencion, deteccion y
                control del lavado de activos.
              </p>
              <p>
                El uso de activos virtuales en la economia representa un desafio para la prevencion
                y el combate al lavado de activos y al financiamiento del terrorismo. Aunque Colombia
                no cuenta con una legislacion que regule explicitamente los activos virtuales, existen
                normas generales como la Ley 1943 de 2018 y lineamientos aplicables al sector.
              </p>
              <p>
                La Unidad de Informacion y Analisis Financiero emitio la Resolucion 314 de 2021 del
                15 de diciembre de 2021, implementando la obligacion de reporte para proveedores de
                servicios de activos virtuales.
              </p>

              <h4>Actividades cubiertas por la Resolucion 314 de 2021</h4>
              <ol className="legal-modal-list" type="a">
                <li>Intercambio entre activos virtuales y monedas fiduciarias.</li>
                <li>Intercambio entre una o mas formas de activos virtuales.</li>
                <li>Transferencias de activos virtuales.</li>
                <li>Custodia o administracion de activos virtuales o sus instrumentos de control.</li>
                <li>Servicios financieros relacionados con oferta o venta de activos virtuales.</li>
                <li>En general, servicios relacionados con activos virtuales.</li>
              </ol>

              <p>
                ACTIVOS DIGITALES S.A.S. esta establecida como proveedor de servicios de activos
                virtuales ante la UIAF y se adhiere al compromiso de Colombia con GAFILAT para mitigar
                riesgos de LA/FT mediante mecanismos de deteccion, seguimiento, monitoreo y control
                dentro del sistema SAGRILAFT LA/FT/FPADM.
              </p>
              <p>
                Aunque por su naturaleza no se encuentra obligada a implementar SAGRILAFT, la
                organizacion ha decidido hacerlo voluntariamente para dar cumplimiento a la Resolucion
                314 de 2021 y a la Circular 100-000016 de 24 de diciembre de 2020 de la Superintendencia
                de Sociedades.
              </p>
              <p>
                Mediante su manual del sistema de autocontrol y gestion del riesgo integral, la
                organizacion establecio medidas, procedimientos y protocolos de prevencion y control
                para evitar que sea utilizada por grupos de interes para dar apariencia de legalidad
                a recursos provenientes de actividades ilicitas o para financiar actividades terroristas.
              </p>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
