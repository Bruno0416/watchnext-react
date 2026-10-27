import { Link } from "react-router";

import { MediaType } from "../../../models/media.type";
import { getMediaImageUrl } from "../../utils/media.image";

import "./content.card.css";

// ---------- propiedades de la tarjeta compartida ----------

export type MediaCardContent = {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  releaseDate: string | null;
  voteAverage: number;
};

type ContentCardProps = {
  content: MediaCardContent;
  detailTo?: string;
  onAddToList?: () => void;
  position?: number;
  onRemove?: () => void;
  removeLabel?: string;
  busy?: boolean;
};

// ---------- tarjeta de contenido ----------

export function ContentCard({
  content,
  detailTo,
  onAddToList,
  position,
  onRemove,
  removeLabel,
  busy = false,
}: ContentCardProps) {
  const poster = getMediaImageUrl(
    content.posterPath ?? content.backdropPath,
    "w342",
  );
  const year = content.releaseDate?.slice(0, 4) || "S/F";
  const rating = Number.isFinite(content.voteAverage)
    ? content.voteAverage.toFixed(1)
    : "0.0";
  const kind = content.mediaType === MediaType.MOVIE ? "Película" : "Serie";

  const posterContent = poster ? (
    <img
      src={poster}
      className="media-card-poster"
      alt={`Portada de ${content.title}`}
      loading="lazy"
    />
  ) : (
    <span className="media-card-poster-placeholder" aria-hidden="true">
      <i className="bi bi-film" />
    </span>
  );

  return (
    <article
      className="content-card media-card"
      data-content-id={content.tmdbId}
      data-content-type={content.mediaType}
    >
      <div className="media-card-poster-wrap">
        {position !== undefined && (
          <span className="media-card-position" aria-label={`Posición ${position}`}>
            {position}
          </span>
        )}

        {detailTo ? (
          <Link
            className="media-card-poster-link"
            to={detailTo}
            aria-label={`Ver detalle de ${content.title}`}
          >
            {posterContent}
          </Link>
        ) : (
          <div className="media-card-poster-link">{posterContent}</div>
        )}

        {onRemove ? (
          <button
            className="media-card-action media-card-remove-button"
            type="button"
            onClick={onRemove}
            disabled={busy}
            aria-label={removeLabel ?? `Quitar ${content.title}`}
            title="Quitar contenido"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        ) : onAddToList ? (
          <button
            className="media-card-action content-add-button"
            type="button"
            onClick={onAddToList}
            aria-label={`Agregar ${content.title} a una lista`}
            title="Agregar a lista"
          >
            <i className="bi bi-plus-lg" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="media-card-body">
        <h3 className="media-card-title" title={content.title}>
          {detailTo ? (
            <Link className="media-card-link" to={detailTo}>
              {content.title}
            </Link>
          ) : (
            <span className="media-card-link">{content.title}</span>
          )}
        </h3>

        <div className="media-card-meta">
          <span className="media-card-details">
            <span>{kind}</span>
            <span aria-hidden="true">·</span>
            <span>{year}</span>
          </span>

          <span
            className="media-card-rating"
            aria-label={`Calificación ${rating} de 10`}
          >
            <i className="bi bi-star-fill" aria-hidden="true" />
            {rating}
          </span>
        </div>
      </div>
    </article>
  );
}
