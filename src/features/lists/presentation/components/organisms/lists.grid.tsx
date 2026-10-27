import type { ListSummary } from "../../../domain/entities/list.summary";
import { ListStatus } from "../atoms/list.status";
import { ListCard } from "../molecules/list.card";

type ListsGridProps = {
  lists: ListSummary[];
};

export function ListsGrid({ lists }: ListsGridProps) {
  if (lists.length === 0) {
    return (
      <ListStatus
        icon="collection"
        title="Todavia no tienes listas"
        description="Crea una para ir guardando lo que quieres ver."
      />
    );
  }

  return (
    <div className="lists grid">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
