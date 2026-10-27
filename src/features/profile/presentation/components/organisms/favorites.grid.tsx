import type { ProfileFavorite } from "../../../domain/entities/profile.favorite";
import { FavoriteCard } from "../molecules/favorite.card";

type FavoritesGridProps = {
  favorites: ProfileFavorite[];
  isMine: boolean;
  busyKey: string | null;
  onRemove: (f: ProfileFavorite) => void;
};

export function FavoritesGrid({ favorites, isMine, busyKey, onRemove }: FavoritesGridProps) {
  return (
    <section className="profile favorites" aria-label="Favoritos">
      <h2 className="profile section-title">
        Favoritos <span className="profile section-count">{favorites.length}</span>
      </h2>

      {favorites.length === 0 ? (
        <p className="profile empty">
          {isMine
            ? "Todavia no tienes favoritos. Se eligen en el onboarding y desde el detalle de cada titulo."
            : "Este perfil no tiene favoritos todavia."}
        </p>
      ) : (
        <div className="profile favorites-grid">
          {favorites.map((f, i) => (
            <FavoriteCard
              key={f.key}
              favorite={f}
              position={i + 1}
              canRemove={isMine}
              busy={busyKey === f.key}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
