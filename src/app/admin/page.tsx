import { redirect } from 'next/navigation';
import { getSessionUser, isAdminAuthenticated, listAdminUsers } from '@/lib/admin-auth';
import { listComplianceDocuments } from '@/lib/sagrilaft-store';

type AdminPageProps = {
  searchParams: Promise<{ saved?: string; userSaved?: string; msg?: string }>;
};

function getDocumentLabel(key: string) {
  if (key === 'sagrilaft') return 'Sagrilaft';
  if (key === 'organigrama') return 'Organigrama';
  if (key === 'politica-datos') return 'Politica de Datos';
  return key;
}

function getUploadLabel(key: string) {
  return key === 'organigrama' ? 'Subir archivo (PDF o imagen)' : 'Subir PDF';
}

function getUploadAccept(key: string) {
  return key === 'organigrama' ? 'application/pdf,.pdf,image/png,image/jpeg,image/jpg,image/webp' : 'application/pdf,.pdf';
}

function getUrlPlaceholder(key: string) {
  return key === 'organigrama'
    ? '/documentos/organigrama.pdf o /documentos/organigrama.png'
    : '/documentos/nombre.pdf o URL externa';
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const docs = await listComplianceDocuments();
  const users = listAdminUsers();

  const saveOk = params.saved === '1';
  const saveError = params.saved === '0';
  const saveErrorMessage = params.msg === 'pdf'
    ? 'El archivo cargado debe ser un PDF valido.'
    : params.msg === 'file-type'
      ? 'Organigrama permite PDF o imagen. Los otros documentos solo PDF.'
    : params.msg === 'size'
      ? 'El archivo supera el limite de 20 MB.'
      : 'Debes indicar una URL valida del PDF y un documento valido.';
  const userOk = params.userSaved === '1';
  const userError = params.userSaved === '0' || params.userSaved === 'forbidden';
  const userErrorMessage = params.userSaved === 'forbidden'
    ? 'Solo un usuario con rol admin puede crear usuarios.'
    : params.msg || 'No se pudo crear el usuario.';

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-card">
        <header className="admin-dashboard-head">
          <div>
            <p className="admin-auth-kicker">Dashboard interno</p>
            <h1>Administrador de Cumplimiento</h1>
            <p>
              Usuario activo: <strong>{sessionUser.username}</strong> ({sessionUser.role}).
              Desde aqui puedes actualizar los PDFs de Sagrilaft, Organigrama y Politica de Datos.
            </p>
          </div>
          <form method="POST" action="/api/admin/logout">
            <button type="submit" className="admin-logout-btn">Cerrar sesion</button>
          </form>
        </header>

        {saveOk && <div className="admin-success">Documento actualizado correctamente.</div>}
        {saveError && <div className="admin-auth-error">{saveErrorMessage}</div>}
        {userOk && <div className="admin-success">Usuario creado correctamente.</div>}
        {userError && <div className="admin-auth-error">{userErrorMessage}</div>}

        <div className="admin-documents-grid">
          {docs.map((doc) => (
            <article key={doc.key} className="admin-document-card">
              <h2>{getDocumentLabel(doc.key)}</h2>

              <form method="POST" action="/api/admin/sagrilaft" encType="multipart/form-data" className="admin-dashboard-form">
                <input type="hidden" name="documentKey" value={doc.key} />

                <label>
                  Titulo
                  <input type="text" name="title" defaultValue={doc.title} required />
                </label>

                <label>
                  Descripcion
                  <textarea name="description" rows={3} defaultValue={doc.description} required />
                </label>

                <label>
                  {getUploadLabel(doc.key)}
                  <input type="file" name="pdfFile" accept={getUploadAccept(doc.key)} />
                </label>

                <label>
                  URL del archivo (opcional)
                  <input
                    type="text"
                    name="pdfUrl"
                    defaultValue={doc.pdfUrl}
                    placeholder={getUrlPlaceholder(doc.key)}
                  />
                </label>

                <button type="submit">Guardar {getDocumentLabel(doc.key)}</button>
              </form>

              <p className="admin-updated">
                Ultima actualizacion: {new Date(doc.updatedAt).toLocaleString('es-CO')}
                {doc.updatedByUsername ? ` por ${doc.updatedByUsername}` : ''}
              </p>
            </article>
          ))}
        </div>

        <section className="admin-users-section">
          <h2>Usuarios del Panel</h2>

          {sessionUser.role === 'admin' ? (
            <form method="POST" action="/api/admin/users" className="admin-dashboard-form admin-user-form">
              <label>
                Usuario nuevo
                <input type="text" name="username" required minLength={3} />
              </label>

              <label>
                Contrasena temporal
                <input type="password" name="password" required minLength={8} />
              </label>

              <label>
                Rol
                <select name="role" defaultValue="editor">
                  <option value="editor">Editor (puede actualizar documentos)</option>
                  <option value="admin">Admin (puede crear usuarios y editar documentos)</option>
                </select>
              </label>

              <button type="submit">Crear usuario</button>
            </form>
          ) : (
            <p className="admin-updated">Tu rol es editor, por lo tanto no puedes crear usuarios.</p>
          )}

          <div className="admin-user-list-wrap">
            <table className="admin-user-list">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.createdAt).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
