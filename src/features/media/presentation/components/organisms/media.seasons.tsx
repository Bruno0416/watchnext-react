import { useState } from "react";
import type { MediaSeason } from "../../../domain/entities/media.detail";
import { MediaSeasonCard } from "../molecules/media.season.card";

export function MediaSeasons({ seasons }: { seasons: MediaSeason[] }) {
  const [visibleCount, setVisibleCount] = useState(6);
  if (!seasons.length) return null;

  return (
    <section
      className="media-detail-section"
      aria-labelledby="media-seasons-title"
    >
      <h2 id="media-seasons-title">Temporadas</h2>
      <div className="media-detail-seasons">
        {seasons.slice(0, visibleCount).map((season) => (
          <MediaSeasonCard key={season.id} season={season} />
        ))}
      </div>
      {visibleCount < seasons.length && (
        <button
          className="btn btn-outline-primary media-detail-more"
          type="button"
          onClick={() => setVisibleCount((current) => current + 6)}
        >
          Ver más temporadas ({seasons.length - visibleCount} restantes)
        </button>
      )}
    </section>
  );
}
