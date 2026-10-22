import type { ListItem } from "../../../domain/entities/list.item";
import { MediaTypeChip } from "../atoms/media.type.chip";
import { PosterImage } from "../atoms/poster.image";

type ListItemCardProps = {
  item: ListItem;
  busy: boolean;
  onRemove: (item: ListItem) => void;
};

export function ListItemCard({ item, busy, onRemove }: ListItemCardProps) {
  // segun el tipo muestro duracion o temporadas
  const extra = item.isMovie
    ? item.duration
      ? `${item.duration} min`
      : null
    : item.numberOfSeasons
      ? item.numberOfSeasons === 1
        ? "1 temporada"
        : `${item.numberOfSeasons} temporadas`
      : null;

  return (
    <article className="lists item">
      <PosterImage posterPath={item.posterPath} className="item-poster" />

      <div className="lists item-body">
        <div className="lists item-top">
          <MediaTypeChip isMovie={item.isMovie} />
          {item.year && <span className="lists item-year">{item.year}</span>}
        </div>

        <h3 className="lists item-title">{item.title}</h3>

        <p className="lists item-meta">
          <span>
            <i className="bi bi-star-fill" aria-hidden="true" />
            {item.voteAverage.toFixed(1)}
          </span>
          {extra && <span>{extra}</span>}
        </p>
      </div>

      <button
        type="button"
        className="btn btn-link lists item-remove"
        disabled={busy}
        aria-label={`Quitar ${item.title} de la lista`}
        onClick={() => onRemove(item)}
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>
    </article>
  );
}
