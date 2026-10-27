import type { ListItem } from "../../../domain/entities/list.item";
import { MediaTypeChip } from "../atoms/media.type.chip";
import { PosterImage } from "../atoms/poster.image";

type SearchResultRowProps = {
  item: ListItem;
  alreadyAdded: boolean;
  busy: boolean;
  onAdd: (item: ListItem) => void;
};

export function SearchResultRow({
  item,
  alreadyAdded,
  busy,
  onAdd,
}: SearchResultRowProps) {
  return (
    <li className="lists result">
      <PosterImage posterPath={item.posterPath} size="w185" className="result-poster" />

      <div className="lists result-body">
        <p className="lists result-title">{item.title}</p>
        <p className="lists result-meta">
          <MediaTypeChip isMovie={item.isMovie} />
          {item.year && <span>{item.year}</span>}
        </p>
      </div>

      {/* si ya esta en la lista no dejo agregarlo de nuevo */}
      {alreadyAdded ? (
        <span className="lists result-added">
          <i className="bi bi-check2" aria-hidden="true" />
          En la lista
        </span>
      ) : (
        <button
          type="button"
          className="btn btn-secondary lists result-add"
          disabled={busy}
          onClick={() => onAdd(item)}
        >
          {busy ? "Agregando..." : "Agregar"}
        </button>
      )}
    </li>
  );
}
