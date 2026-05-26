import Link from 'next/link';

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = Boolean(params.error);

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="admin-auth-kicker">Acceso interno</p>
        <h1>Panel Administrador</h1>
        <p>Ingresa con tu usuario y contrasena para administrar Sagrilaft, Organigrama y Politica de Datos.</p>

        {hasError && <div className="admin-auth-error">Credenciales invalidas. Intenta nuevamente.</div>}

        <form method="POST" action="/api/admin/login" className="admin-auth-form">
          <label>
            Usuario
            <input type="text" name="username" required autoComplete="username" />
          </label>
          <label>
            Contrasena
            <input type="password" name="password" required autoComplete="current-password" />
          </label>
          <button type="submit">Entrar al dashboard</button>
        </form>

        <Link href="/" className="admin-auth-back">Volver al sitio</Link>
      </section>
    </main>
  );
}
