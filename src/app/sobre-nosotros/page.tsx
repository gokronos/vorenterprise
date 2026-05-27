export default function SobreNosotrosPage() {
  return (
    <main className="home-page">
      <section className="section-shell section-shell-services">
        <div className="about-page">
          <header className="about-hero">
            <p className="services-kicker">Sobre Nosotros</p>
            <h1>Construimos infraestructura digital con criterio, cumplimiento y vision de largo plazo.</h1>
            <p>
              V.O.R. ENTERPRISE S.A.S. integra tecnologia, seguridad y enfoque normativo para acompañar a
              empresas y aliados en el diseño de soluciones de activos virtuales y software especializado.
            </p>
            <div className="about-badges" aria-label="Atributos clave">
              <span className="about-badge">Tecnologia</span>
              <span className="about-badge">Cumplimiento</span>
              <span className="about-badge">Seguridad</span>
              <span className="about-badge">Activos virtuales</span>
            </div>
          </header>

          <section className="about-split" aria-label="Presentacion institucional">
            <article className="about-story about-story-intro">
              <h2>Quienes somos</h2>
              <p>
                Somos una organizacion enfocada en diseñar experiencias digitales robustas, seguras y alineadas con
                estandares de cumplimiento. Nuestra propuesta une arquitectura de software, acompañamiento tecnico y
                vision institucional para construir soluciones sostenibles.
              </p>

              <div className="about-mini-grid">
                <div className="about-mini-card">
                  <span>01</span>
                  <strong>Arquitectura</strong>
                  <p>Diseño tecnico orientado a estabilidad y escalabilidad.</p>
                </div>
                <div className="about-mini-card">
                  <span>02</span>
                  <strong>Seguridad</strong>
                  <p>Controles y trazabilidad para operar con confianza.</p>
                </div>
                <div className="about-mini-card">
                  <span>03</span>
                  <strong>Vinculacion</strong>
                  <p>Acompañamiento claro para aliados y procesos institucionales.</p>
                </div>
              </div>
            </article>

            <aside className="about-visual" aria-label="Imagen corporativa">
              <img
                src="/imagenes/vorEnterprise-imagen-1.png"
                alt="Infraestructura digital y seguridad de V.O.R. Enterprise"
                className="about-visual-image"
              />
              <div className="about-visual-overlay">
                <strong>Firma tecnologica</strong>
                <p>Orientada a activos virtuales, cumplimiento y seguridad institucional.</p>
              </div>
            </aside>
          </section>

          <section className="about-mission" aria-label="Mision y vision">
            <div>
              <h2>Mision</h2>
              <p>
                Desarrollar soluciones de infraestructura tecnologica y arquitectura de software de vanguardia que
                impulsen operaciones confiables, escalables y alineadas con estandares normativos estrictos.
              </p>
            </div>
            <ul className="about-list">
              <li>Arquitectura de software para entornos corporativos y transaccionales.</li>
              <li>Integracion de controles de seguridad y trazabilidad operativa.</li>
              <li>Acompañamiento tecnico con enfoque institucional y preventivo.</li>
            </ul>
          </section>

          <section className="about-story">
            <h2>Vision</h2>
            <p>
              Consolidarnos como una firma referente en software, resguardo de informacion e infraestructura
              especializada, reconocida por la calidad tecnica, la seriedad institucional y la capacidad de ejecutar
              proyectos con vision estrategica.
            </p>
          </section>

          <section className="about-grid" aria-label="Pilares institucionales">
            <article className="about-card">
              <h3>Criterio tecnico</h3>
              <p>
                Diseñamos soluciones con foco en estabilidad, mantenibilidad y claridad operativa, para que cada
                componente aporte valor real al negocio.
              </p>
            </article>
            <article className="about-card">
              <h3>Marco normativo</h3>
              <p>
                Cada flujo se piensa con trazabilidad, validacion y controles orientados a cumplimiento y gestion del
                riesgo.
              </p>
            </article>
            <article className="about-card">
              <h3>Acompañamiento</h3>
              <p>
                Trabajamos de forma cercana con aliados y usuarios para convertir necesidades complejas en procesos
                claros y seguros.
              </p>
            </article>
          </section>

          <section className="about-cta">
            <div>
              <h2>Un enfoque serio para construir relaciones digitales duraderas.</h2>
              <p>
                Si desea conocer mas sobre nuestros servicios, cumplimiento o procesos de vinculacion, puede escribirnos
                directamente.
              </p>
            </div>
            <div className="about-cta-actions">
              <a className="about-cta-link" href="/#contacto">
                Contacto
              </a>
              <a className="about-cta-link secondary" href="/preguntas-frecuentes">
                Ver FAQ
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
