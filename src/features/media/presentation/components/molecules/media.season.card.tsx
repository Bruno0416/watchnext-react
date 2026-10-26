import type { MediaSeason } from "../../../domain/entities/media.detail";
import { MediaArtwork } from "../atoms/media.artwork";

export function MediaSeasonCard({ season }: { season: MediaSeason }) {
  return (
    <article className="media-detail-season">
      <MediaArtwork
        path={season.posterPath}
        alt={`Póster de ${season.name}`}
        variant="season"
      />
      <div>
        <h3>{season.name}</h3>
        <p className="media-detail-muted">{season.episodeCount} episodios</p>
        {season.overview && <p>{season.overview}</p>}
      </div>
    </article>
  );
}
