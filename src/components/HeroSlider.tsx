export default function HeroSlider() {
  return (
    <section className="hero-slider" aria-label="Banner principal de VOR Enterprise">
      <article className="hero-copy">
        <h1>
          ¡DONDE LA <span className="is-highlight">TECNOLOGÍA</span> Y LAS{' '}
          <span className="is-highlight">FINANZAS</span> SE ENCUENTRAN CON LA{' '}
          <span className="is-highlight">SEGURIDAD!</span>
        </h1>
        <p>
          Diseño de infraestructura, arquitectura de software avanzada y soluciones globales de ingeniería.
          Respaldados por una sólida base tecnológica y un estricto marco normativo, proporcionamos un entorno
          robusto, transparente y seguro para el ecosistema digital de nuestros usuarios.
        </p>
        <a href="#contacto" className="hero-cta">
          CONTÁCTANOS
        </a>
      </article>

      <figure className="hero-media" aria-hidden="true">
        <img src="/imagenes/vorEnterprise.png" alt="" className="hero-image" />
      </figure>
    </section>
  );
}