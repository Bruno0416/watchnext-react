import type { MediaPerson } from "../../../domain/entities/media.detail";
import { MediaCastCard } from "../molecules/media.cast.card";

export function MediaCast({ cast }: { cast: MediaPerson[] }) {
  if (!cast.length) return null;

  return (
    <section
      className="media-detail-section"
      aria-labelledby="media-cast-title"
    >
      <h2 id="media-cast-title">Reparto</h2>
      <div className="media-detail-cast">
        {cast.map((person) => (
          <MediaCastCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
