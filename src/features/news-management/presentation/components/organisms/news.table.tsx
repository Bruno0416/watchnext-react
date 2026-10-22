import type { ManagedNews } from "../../../domain/entities/managed.news";
import { ManagementStatus } from "../atoms/management.status";
import { NewsRow } from "../molecules/news.row";

type NewsTableProps = {
  news: ManagedNews[];
  hayBusqueda: boolean;
  deletingId: string | null;
  isDeleting: boolean;
  onEdit: (n: ManagedNews) => void;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export function NewsTable({ news, hayBusqueda, deletingId, isDeleting, ...acciones }: NewsTableProps) {
  // vacio distinto si es porque el filtro no encontro nada
  if (news.length === 0) {
    return hayBusqueda ? (
      <ManagementStatus icon="search" title="Nada coincide con tu busqueda" description="Prueba con otra palabra." />
    ) : (
      <ManagementStatus icon="newspaper" title="Aun no hay noticias" description="Crea la primera con el boton de arriba." />
    );
  }

  return (
    <ul className="nm list" aria-label="Noticias publicadas">
      {news.map((n) => (
        <NewsRow
          key={n.id}
          news={n}
          askingDelete={deletingId === n.id}
          isDeleting={isDeleting}
          {...acciones}
        />
      ))}
    </ul>
  );
}
