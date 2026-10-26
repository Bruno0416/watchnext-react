import type { MediaPerson } from "../../../domain/entities/media.detail";
import { MediaArtwork } from "../atoms/media.artwork";

export function MediaCastCard({ person }: { person: MediaPerson }) {
  return (
    <article className="media-detail-cast-card">
      <MediaArtwork
        path={person.profilePath}
        alt={`Foto de ${person.name}`}
        variant="person"
      />
      <h3>{person.name}</h3>
      {person.character && <p>{person.character}</p>}
    </article>
  );
}
