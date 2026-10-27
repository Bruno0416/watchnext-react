import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { container } from "../../../../core/di/container";
import type { SearchUsers } from "../../domain/usecases/search.users";
import type { CreateUser } from "../../domain/usecases/create.user";
import { UserStatus } from "../components/atoms/user.status";
import { UserFilters } from "../components/molecules/user.filters";
import { UsersTable } from "../components/organisms/users.table";
import { useUserListViewModel } from "../viewmodels/user.list.viewmodel";
import "./style/user.management.page.css";

// /admin/usuarios
export function UsersPage() {
  const searchUsers = container.resolve<SearchUsers>("searchUsers");
  const createUser = container.resolve<CreateUser>("createUser");
  const { state, visibles, setQuery, setRole, reload } = useUserListViewModel(searchUsers);

  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setNewRole] = useState<"USER" | "ADMIN">("USER");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      await createUser.call({ email, password, role });
      setEmail("");
      setPassword("");
      setNewRole("USER");
      setCreating(false);
      setNotice("Cuenta creada. Su perfil se configurara en el primer ingreso.");
      reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="um page">
      <Link to="/admin" className="um back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Panel de administracion
      </Link>

      <header className="um header">
        <div className="um header-actions">
          <div>
            <h1 className="um title">Usuarios</h1>
            <p className="um subtitle">Consulta y gestiona cuentas de la plataforma.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => { setCreating((v) => !v); setFormError(null); }}>
            <i className={`bi bi-${creating ? "x-lg" : "person-plus"}`} aria-hidden="true" /> {creating ? "Cancelar alta" : "Crear usuario"}
          </button>
        </div>
      </header>

      {notice && <p className="um notice" role="status">{notice}</p>}
      {creating && (
        <form className="um create-form" onSubmit={submitCreate}>
          <h2 className="um form-title">Nueva cuenta</h2>
          <div className="um form-grid">
            <label className="um field">Correo electronico
              <input className="form-control" type="email" autoComplete="off" required maxLength={100} value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving}/>
            </label>
            <label className="um field">Contraseña inicial
              <input className="form-control" type="password" autoComplete="new-password" required minLength={6} maxLength={10} value={password} onChange={(e) => setPassword(e.target.value)} disabled={saving}/>
            </label>
            <label className="um field">Rol
              <select className="form-select" value={role} onChange={(e) => setNewRole(e.target.value as "USER" | "ADMIN")} disabled={saving}>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
          </div>
          <p className="um field-help">Los usuarios normales completan su perfil al ingresar; los administradores acceden directamente al panel.</p>
          {formError && <p className="um form-error" role="alert">{formError}</p>}
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creando..." : "Guardar cuenta"}</button>
        </form>
      )}

      <UserFilters query={state.query} role={state.role} total={visibles.length} onQuery={setQuery} onRole={setRole} />

      {state.isLoading && <UserStatus icon="hourglass-split" title="Cargando usuarios..." />}
      {!state.isLoading && state.error && (
        <UserStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>Reintentar</button>
        </UserStatus>
      )}
      {!state.isLoading && !state.error && (
        <UsersTable users={visibles} filtrando={state.query.trim() !== "" || state.role !== "ALL"} />
      )}
    </div>
  );
}
