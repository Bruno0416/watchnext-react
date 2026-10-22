import type { ListItem } from "../../../domain/entities/list.item";
import { ListStatus } from "../atoms/list.status";
import { ListItemCard } from "../molecules/list.item.card";

type ListItemsProps = {
  items: ListItem[];
  busyKey: string | null;
  onRemove: (item: ListItem) => void;
};

export function ListItems({ items, busyKey, onRemove }: ListItemsProps) {
  if (items.length === 0) {
    return (
      <ListStatus
        icon="plus-circle"
        title="Esta lista esta vacia"
        description="Usa el boton Agregar contenido para buscar peliculas o series."
      />
    );
  }

  return (
    <div className="lists items">
      {items.map((item) => (
        <ListItemCard
          key={item.key}
          item={item}
          busy={busyKey === item.key}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
