import { ContentCard } from "../../../../../core/ui/components/molecules/content.card";
import type { ProfileFavorite } from "../../../domain/entities/profile.favorite";

type FavoriteCardProps = {
  favorite: ProfileFavorite;
  position: number;
  canRemove: boolean;
  busy: boolean;
  onRemove: (f: ProfileFavorite) => void;
};

// ---------- tarjeta reutilizada para favoritos ----------
export function FavoriteCard({ favorite, position, canRemove, busy, onRemove }: FavoriteCardProps) {
  return (
    <ContentCard
      content={favorite}
      detailTo={`/media/${favorite.mediaType}/${favorite.tmdbId}`}
      position={position}
      onRemove={canRemove ? () => onRemove(favorite) : undefined}
      removeLabel={`Quitar ${favorite.title} de favoritos`}
      busy={busy}
    />
  );
}
