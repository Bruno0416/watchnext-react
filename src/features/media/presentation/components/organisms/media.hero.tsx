import { getMediaImageUrl } from "../../../../../core/ui/utils/media.image";
import type { MediaDetail } from "../../../domain/entities/media.detail";
import { MediaArtwork } from "../atoms/media.artwork";
import { MediaHeroInfo } from "../molecules/media.hero.info";

export function MediaHero({ detail }: { detail: MediaDetail }) {
  const backdrop = getMediaImageUrl(
    detail.backdropPath ?? detail.posterPath,
    "original",
  );

  return (
    <header className="media-detail-hero">
      {backdrop && (
        <img className="media-detail-backdrop" src={backdrop} alt="" />
      )}
      <div className="media-detail-scrim" aria-hidden="true" />
      <div className="media-detail-hero-content">
        <div className="media-detail-poster-wrap">
          <MediaArtwork
            path={detail.posterPath}
            alt={`Póster de ${detail.title}`}
            variant="poster"
          />
        </div>
        <MediaHeroInfo detail={detail} />
      </div>
    </header>
  );
}
