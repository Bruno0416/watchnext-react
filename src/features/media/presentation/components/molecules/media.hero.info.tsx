import { MediaType } from "../../../../../core/models/media.type";
import type { MediaDetail } from "../../../domain/entities/media.detail";

export function MediaHeroInfo({ detail }: { detail: MediaDetail }) {
  const movie = detail.mediaType === MediaType.MOVIE;
  const rating =
    detail.voteAverage !== null && detail.voteAverage > 0
      ? detail.voteAverage.toFixed(1)
      : null;
  const releaseDate = detail.releaseDate?.slice(0, 4) || "Fecha no disponible";
  const duration =
    movie && detail.runtimeMinutes
      ? `${Math.floor(detail.runtimeMinutes / 60)} h ${detail.runtimeMinutes % 60} min`
      : null;

  return (
    <div className="media-detail-hero-info">
      <span className="media-detail-kicker">
        {movie ? "Película" : "Serie"}
      </span>
      <h1>{detail.title}</h1>
      <div className="media-detail-meta">
        <span>{releaseDate}</span>
        {duration && <span>{duration}</span>}
        {!movie && detail.numberOfSeasons !== null && (
          <span>{detail.numberOfSeasons} temporadas</span>
        )}
        {!movie && detail.numberOfEpisodes !== null && (
          <span>{detail.numberOfEpisodes} episodios</span>
        )}
        {rating ? (
          <span className="media-detail-rating" title="Puntuación del catálogo">
            <i className="bi bi-star-fill" aria-hidden="true" /> Catálogo:{" "}
            {rating} / 10
          </span>
        ) : (
          <span>Catálogo: sin puntuación</span>
        )}
      </div>
      {detail.genres.length > 0 && (
        <div className="media-detail-genres">
          {detail.genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      )}
      {movie && detail.directors.length > 0 && (
        <p className="media-detail-credit">
          <strong>Dirección:</strong>{" "}
          {detail.directors.map((person) => person.name).join(", ")}
        </p>
      )}
      {!movie && detail.createdBy.length > 0 && (
        <p className="media-detail-credit">
          <strong>Creación:</strong>{" "}
          {detail.createdBy.map((person) => person.name).join(", ")}
        </p>
      )}
    </div>
  );
}
