import type { ManagedNews } from "../../../domain/entities/managed.news";

type NewsRowProps = {
  news: ManagedNews;
  askingDelete: boolean;
  isDeleting: boolean;
  onEdit: (n: ManagedNews) => void;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" });

// una fila de la tabla; si estoy por borrarla muestro la confirmacion ahi mismo
export function NewsRow({
  news,
  askingDelete,
  isDeleting,
  onEdit,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: NewsRowProps) {
  return (
    <li className={`nm item ${askingDelete ? "confirming" : ""}`.trim()}>
      <div className="nm row-info">
        <p className="nm row-title">{news.title}</p>
        <p className="nm row-summary">{news.summary}</p>
        <time className="nm row-date" dateTime={news.publishedAt.toISOString()}>
          {formatter.format(news.publishedAt)}
        </time>
      </div>

      {askingDelete ? (
        <div className="nm row-actions" role="group" aria-label="Confirmar eliminacion">
          <span className="nm confirm-text">¿Eliminar esta noticia?</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancelDelete} disabled={isDeleting}>
            Cancelar
          </button>
          <button type="button" className="btn btn-sm btn-danger" onClick={onConfirmDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Si, eliminar"}
          </button>
        </div>
      ) : (
        <div className="nm row-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(news)}
            aria-label={`Editar ${news.title}`}
          >
            <i className="bi bi-pencil" aria-hidden="true" /> Editar
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onAskDelete(news.id)}
            aria-label={`Eliminar ${news.title}`}
          >
            <i className="bi bi-trash" aria-hidden="true" /> Eliminar
          </button>
        </div>
      )}
    </li>
  );
}
