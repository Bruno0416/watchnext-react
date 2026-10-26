import { MediaType } from "../../../../../core/models/media.type";
import type { MediaDetail } from "../../../domain/entities/media.detail";

export function MediaAdditionalInfo({ detail }: { detail: MediaDetail }) {
  const originalTitle =
    detail.mediaType === MediaType.MOVIE ? detail.originalTitle : null;
  const status = detail.mediaType === MediaType.TV ? detail.status : null;
  const hasExtras =
    originalTitle ||
    status ||
    detail.voteCount !== null ||
    detail.imdbId ||
    detail.keywords.length ||
    detail.alternativeTitles.length;
  if (!hasExtras) return null;

  return (
    <section
      className="media-detail-section"
      aria-labelledby="media-extra-title"
    >
      <h2 id="media-extra-title">Información adicional</h2>
      <dl className="media-detail-facts">
        {originalTitle && (
          <>
            <dt>Título original</dt>
            <dd>{originalTitle}</dd>
          </>
        )}
        {status && (
          <>
            <dt>Estado</dt>
            <dd>{status}</dd>
          </>
        )}
        {detail.voteCount !== null && (
          <>
            <dt>Votos</dt>
            <dd>{detail.voteCount.toLocaleString()}</dd>
          </>
        )}
        {detail.imdbId && (
          <>
            <dt>IMDb</dt>
            <dd>
              <a
                href={`https://www.imdb.com/title/${detail.imdbId}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver ficha externa
              </a>
            </dd>
          </>
        )}
      </dl>
      {(detail.keywords.length > 0 || detail.alternativeTitles.length > 0) && (
        <details className="media-detail-extras">
          <summary>Ver palabras clave y títulos alternativos</summary>
          {detail.keywords.length > 0 && (
            <p>
              <strong>Palabras clave:</strong> {detail.keywords.join(", ")}
            </p>
          )}
          {detail.alternativeTitles.length > 0 && (
            <p>
              <strong>Otros títulos:</strong>{" "}
              {Array.from(new Set(detail.alternativeTitles))
                .slice(0, 15)
                .join(", ")}
            </p>
          )}
        </details>
      )}
    </section>
  );
}
