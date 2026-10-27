import { container } from "../../../../core/di/container";
import type { GetAdminSummary } from "../../domain/usecases/get.admin.summary";
import { AdminSections } from "../components/organisms/admin.sections";
import { useAdminViewModel } from "../viewmodels/admin.viewmodel";
import "./style/admin.page.css";

const dateFormatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" });

// ---------- resumen de administracion ----------
export function AdminPage() {
  const getAdminSummary = container.resolve<GetAdminSummary>("getAdminSummary");
  const { state, reload } = useAdminViewModel(getAdminSummary);
  const summary = state.summary;

  // ---------- indicadores derivados de los datos actuales ----------
  // los administradores no necesitan onboarding
  const regularUsers = summary ? summary.totalUsers - summary.admins : null;
  const completed = regularUsers !== null && summary
    ? Math.max(0, regularUsers - summary.pendingOnboarding)
    : null;
  const completionRate = regularUsers !== null && regularUsers > 0 && completed !== null
    ? Math.round((completed / regularUsers) * 100)
    : null;

  return (
    <div className="admin page">
      <header className="admin hero">
        <div>
          <span className="admin eyebrow"><i className="bi bi-activity" aria-hidden="true" /> Vista general</span>
          <h1 className="admin title">Panel de administración</h1>
          <p className="admin subtitle">Supervisa las cuentas de WatchNext y gestiona las noticias publicadas.</p>
        </div>
        <button className="admin refresh" type="button" onClick={reload} disabled={state.isLoading}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true" />
          {state.isLoading ? "Actualizando..." : "Actualizar datos"}
        </button>
      </header>

      {state.error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <span>{state.error}</span>
          <button type="button" className="btn btn-sm btn-outline-dark ms-auto" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      <section className="admin overview" aria-labelledby="admin-overview-title">
        <h2 id="admin-overview-title" className="admin section-title">Resumen de la plataforma</h2>
        <div className="admin kpis" aria-busy={state.isLoading}>
          <div className="admin kpi">
            <div className="admin kpi-heading"><span>Cuentas registradas</span><i className="bi bi-people" aria-hidden="true" /></div>
            <strong className="admin kpi-number">{summary?.totalUsers ?? "—"}</strong>
            <span className="admin kpi-caption">Usuarios y administradores</span>
          </div>
          <div className="admin kpi">
            <div className="admin kpi-heading"><span>Usuarios</span><i className="bi bi-person-check" aria-hidden="true" /></div>
            <strong className="admin kpi-number">{regularUsers ?? "—"}</strong>
            <span className="admin kpi-caption">Cuentas de rol usuario</span>
          </div>
          <div className="admin kpi">
            <div className="admin kpi-heading"><span>Administradores</span><i className="bi bi-shield-check" aria-hidden="true" /></div>
            <strong className="admin kpi-number">{summary?.admins ?? "—"}</strong>
            <span className="admin kpi-caption">Cuentas con rol administrador</span>
          </div>
          <div className="admin kpi">
            <div className="admin kpi-heading"><span>Noticias publicadas</span><i className="bi bi-newspaper" aria-hidden="true" /></div>
            <strong className="admin kpi-number">{summary?.totalNews ?? "—"}</strong>
            <span className="admin kpi-caption">Artículos disponibles</span>
          </div>
        </div>
      </section>

      <div className="admin insights">
        <section className="admin insight" aria-labelledby="admin-profiles-title">
          <div className="admin insight-heading">
            <h2 id="admin-profiles-title" className="admin section-title">Configuración de perfiles</h2>
            <span className="admin insight-emphasis">{completionRate === null ? "—" : `${completionRate}%`}</span>
          </div>
          <p className="admin insight-description">Usuarios que completaron el onboarding</p>
          <div className="admin progress-track" role="progressbar" aria-label="Perfiles configurados" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionRate ?? 0}>
            <span className="admin progress-bar" style={{ width: `${completionRate ?? 0}%` }} />
          </div>
          <div className="admin insight-meta">
            <span>{completed ?? "—"} configurados</span>
            <span>{summary?.pendingOnboarding ?? "—"} pendientes</span>
          </div>
        </section>
        <section className="admin insight" aria-labelledby="admin-publication-title">
          <div className="admin insight-heading">
            <h2 id="admin-publication-title" className="admin section-title">Actividad editorial</h2>
            <i className="bi bi-calendar3 admin insight-icon" aria-hidden="true" />
          </div>
          <p className="admin insight-description">Última noticia publicada</p>
          <p className="admin publication-date">
            {summary ? (summary.lastNewsAt ? dateFormatter.format(summary.lastNewsAt) : "Aún no hay publicaciones") : "—"}
          </p>
          <p className="admin insight-footnote">Fecha de publicación registrada en las noticias actuales.</p>
        </section>
      </div>

      <section className="admin destinations" aria-labelledby="admin-sections-title">
        <div className="admin section-heading">
          <h2 id="admin-sections-title" className="admin section-title">Gestionar contenido</h2>
          <p>Selecciona la sección en la que quieres trabajar.</p>
        </div>
        <AdminSections summary={summary} />
      </section>
    </div>
  );
}
