import type { HomeContentState } from "../../models/home.state";

// ---------- estado visual de una seccion ----------

type SectionStatusProps = {
  title: string;
  state: HomeContentState;
  onRetry?: () => void;
};

export function SectionStatus({ title, state, onRetry }: SectionStatusProps) {
  // 1. mostrar el estado de carga solo sin resultados previos
  if (state.isLoading && state.items.length === 0) {
    return (
      <div className="home-section-skeleton" role="status" aria-label={`Cargando ${title}`}>
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="home-skeleton-card" aria-hidden="true" />
        ))}
        <span className="visually-hidden">Cargando {title}...</span>
      </div>
    );
  }

  // 2. permitir reintentar errores sin ocultar resultados anteriores
  if (state.error) {
    return (
      <div className="home-section-feedback" role="alert">
        <span>
          <i className="bi bi-exclamation-circle me-2" aria-hidden="true" />
          {state.error}
        </span>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" type="button" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  // 3. distinguir una lista vacia de un error
  if (state.items.length === 0 && !state.isLoading) {
    return <p className="home-section-empty">No hay contenido disponible por ahora.</p>;
  }

  return null;
}
