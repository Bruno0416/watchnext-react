import { Link } from "react-router";

import { container } from "../../../../core/di/container";
import type { SearchUsers } from "../../domain/usecases/search.users";
import { UserStatus } from "../components/atoms/user.status";
import { UserFilters } from "../components/molecules/user.filters";
import { UsersTable } from "../components/organisms/users.table";
import { useUserListViewModel } from "../viewmodels/user.list.viewmodel";
import "./style/user.management.page.css";

// /admin/usuarios
export function UsersPage() {
  // ----- dependencias -----
  const searchUsers = container.resolve<SearchUsers>("searchUsers");

  // ----- viewModel -----
  const { state, visibles, setQuery, setRole, reload } = useUserListViewModel(searchUsers);

  return (
    <main className="um page">
      <Link to="/admin" className="um back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Panel de administracion
      </Link>

      <header className="um header">
        <h1 className="um title">Usuarios</h1>
        <p className="um subtitle">Consulta las cuentas registradas. Es solo lectura.</p>
        <p className="um simulated">
          <i className="bi bi-info-circle" aria-hidden="true" /> Datos simulados: el backend todavia no tiene endpoint de administracion.
        </p>
      </header>

      <UserFilters query={state.query} role={state.role} total={visibles.length} onQuery={setQuery} onRole={setRole} />

      {state.isLoading && <UserStatus icon="hourglass-split" title="Cargando usuarios..." />}

      {!state.isLoading && state.error && (
        <UserStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </UserStatus>
      )}

      {!state.isLoading && !state.error && (
        <UsersTable users={visibles} filtrando={state.query.trim() !== "" || state.role !== "ALL"} />
      )}
    </main>
  );
}
