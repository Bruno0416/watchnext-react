import type { ProfileFavorite } from "../../../domain/entities/profile.favorite";
import { PosterImage } from "../atoms/poster.image";

type FavoriteCardProps = {
  favorite: ProfileFavorite;
  position: number;
  canRemove: boolean;
  busy: boolean;
  onRemove: (f: ProfileFavorite) => void;
};

export function FavoriteCard({ favorite, position, canRemove, busy, onRemove }: FavoriteCardProps) {
  return (
    <article className="profile favorite">
      <PosterImage posterPath={favorite.posterPath} className="favorite-poster" />
      <span className="profile favorite-position" aria-hidden="true">
        {position}
      </span>

      <div className="profile favorite-body">
        <h3 className="profile favorite-title">{favorite.title}</h3>
        <p className="profile favorite-meta">
          <span>{favorite.isMovie ? "Pelicula" : "Serie"}</span>
          {favorite.year && <span>{favorite.year}</span>}
          <span>
            <i className="bi bi-star-fill" aria-hidden="true" /> {favorite.voteAverage.toFixed(1)}
          </span>
        </p>
      </div>

      {/* solo en mi perfil puedo sacar favoritos */}
      {canRemove && (
        <button
          type="button"
          className="btn btn-link profile favorite-remove"
          disabled={busy}
          aria-label={`Quitar ${favorite.title} de favoritos`}
          onClick={() => onRemove(favorite)}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
    </article>
  );
}
