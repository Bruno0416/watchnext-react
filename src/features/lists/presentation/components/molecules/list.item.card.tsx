import { ContentCard } from "../../../../../core/ui/components/molecules/content.card";
import type { ListItem } from "../../../domain/entities/list.item";

type ListItemCardProps = {
  item: ListItem;
  busy: boolean;
  canEdit: boolean;
  onRemove: (item: ListItem) => void;
};

// ---------- tarjeta reutilizada para elementos de listas ----------
export function ListItemCard({ item, busy, canEdit, onRemove }: ListItemCardProps) {
  return (
    <ContentCard
      content={item}
      detailTo={`/media/${item.mediaType}/${item.tmdbId}`}
      onRemove={canEdit ? () => onRemove(item) : undefined}
      removeLabel={`Quitar ${item.title} de la lista`}
      busy={busy}
    />
  );
}
