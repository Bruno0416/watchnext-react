import { container } from "../../../../core/di/container";
import type { GetAdminSummary } from "../../domain/usecases/get.admin.summary";
import { AdminSections } from "../components/organisms/admin.sections";
import { useAdminViewModel } from "../viewmodels/admin.viewmodel";
import "./style/admin.page.css";

// /admin: la entrada del administrador
export function AdminPage() {
  // ----- dependencias -----
  const getAdminSummary = container.resolve<GetAdminSummary>("getAdminSummary");

  // ----- viewModel -----
  const { state, reload } = useAdminViewModel(getAdminSummary);

  return (
    <main className="admin page">
      <header className="admin header">
        <h1 className="admin title">Panel de administracion</h1>
        <p className="admin subtitle">Elige que quieres gestionar.</p>
      </header>

      {/* si el resumen falla igual dejo los accesos */}
      {state.error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <span>{state.error}</span>
          <button type="button" className="btn btn-sm btn-outline-dark ms-auto" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      <AdminSections summary={state.summary} />

      <p className="admin simulated">
        <i className="bi bi-info-circle" aria-hidden="true" /> Los numeros salen del mock local, todavia no hay endpoint de administracion.
      </p>
    </main>
  );
}
