type ServiceCard = {
  title: string;
  content: string;
};

const serviceCards: ServiceCard[] = [
  {
    title: 'Proveedor de Servicios de Activos Virtuales - PSAV',
    content:
      'Compra, venta, intercambio y custodia de activos virtuales. Todas las operaciones se disenan bajo procesos estrictos de trazabilidad conforme a las normativas de control.',
  },
  {
    title: 'Arquitectura y Programacion de Software',
    content:
      'Analisis, diseno, documentacion e implementacion de sistemas informaticos modulares, plataformas transaccionales de alto trafico y entornos web de alta disponibilidad, adaptados a las necesidades del mercado empresarial moderno.',
  },
  {
    title: 'Seguridad Informatica y Resguardo de Informacion',
    content:
      'Desarrollo e integracion de herramientas tecnologicas avanzadas, protocolos de cifrado y auditorias de sistemas para proteger los datos corporativos, garantizando la confidencialidad, integridad y disponibilidad de la informacion frente a riesgos digitales.',
  },
  {
    title: 'Hosting, Servidores y Conectividad',
    content:
      'Alojamiento web especializado, administracion avanzada de bases de datos, gestion de dominios y soporte tecnico continuo para asegurar la estabilidad operativa y la conectividad sin interrupciones de plataformas corporativas.',
  },
];

export default function ServicesBlock() {
  return (
    <section className="services-block" aria-labelledby="services-heading">
      <header className="services-header">
        <p className="services-kicker">Soluciones integrales</p>
        <h2 id="services-heading">NUESTROS SERVICIOS</h2>
      </header>

      <div className="services-grid">
        {serviceCards.map((service) => (
          <article key={service.title} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}