import { useState } from "react";
import { MediaType } from "../../../../core/models/media.type";
import { AddToListModal } from "../../../lists/presentation/components/organisms/add.to.list.modal";
import { Link, useParams } from "react-router";
import { container } from "../../../../core/di/container";
import type { GetMediaDetail } from "../../domain/usecases/get.media.detail";
import { MediaAdditionalInfo } from "../components/organisms/media.additional.info";
import { MediaCast } from "../components/organisms/media.cast";
import { MediaHero } from "../components/organisms/media.hero";
import { MovieRatingSection } from "../components/organisms/movie.rating.section";
import { MediaSeasons } from "../components/organisms/media.seasons";
import { MediaTrailer } from "../components/organisms/media.trailer";
import { MediaWatchProviders } from "../components/organisms/media.watch.providers";
import { useMediaViewModel } from "../viewmodels/media.viewmodel";

import "./style/media.page.css";

export function MediaPage() {
  const { mediaType, tmdbId } = useParams();
  return (
    <MediaContent
      key={`${mediaType}/${tmdbId}`}
      mediaType={mediaType}
      tmdbId={tmdbId}
    />
  );
}

function MediaContent({
  mediaType,
  tmdbId,
}: {
  mediaType: string | undefined;
  tmdbId: string | undefined;
}) {
  const [saveOpen, setSaveOpen] = useState(false);
  const getMediaDetail = container.resolve<GetMediaDetail>("getMediaDetail");
  const { state, reload } = useMediaViewModel(
    mediaType,
    tmdbId,
    getMediaDetail,
  );

  if (state.status !== "ready") {
    const title =
      state.status === "loading"
        ? "Cargando contenido..."
        : state.status === "notFound"
          ? "Contenido no encontrado"
          : state.status === "invalid"
            ? "Dirección de contenido inválida"
            : "No se pudo cargar el contenido";
    return (
      <section className="media-page media-detail-status" aria-live="polite">
        <h1>{title}</h1>
        {state.status === "error" && <p>{state.message}</p>}
        {state.status === "notFound" && (
          <p>No encontramos la película o serie solicitada.</p>
        )}
        {state.status === "invalid" && (
          <p>Comprueba el tipo y el identificador del contenido.</p>
        )}
        {state.status === "error" && (
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={reload}
          >
            Reintentar
          </button>
        )}
        {state.status !== "loading" && (
          <Link className="btn btn-primary" to="/inicio">
            Volver al inicio
          </Link>
        )}
      </section>
    );
  }

  const { detail } = state;
  return (
    <section className="media-page">
      <MediaHero detail={detail} onAddToList={() => setSaveOpen(true)} />
      {saveOpen && (
        <AddToListModal
          content={{
            tmdbId: detail.tmdbId,
            mediaType: detail.mediaType,
            title: detail.title,
            posterPath: detail.posterPath,
            backdropPath: detail.backdropPath,
            voteAverage: detail.voteAverage ?? 0,
            releaseDate: detail.releaseDate,
            duration: detail.mediaType === MediaType.MOVIE ? detail.runtimeMinutes : null,
            numberOfSeasons: detail.mediaType === MediaType.TV ? detail.numberOfSeasons : null,
          }}
          onClose={() => setSaveOpen(false)}
        />
      )}
      <div className="media-detail-body">
        <section
          className="media-detail-section"
          aria-labelledby="media-overview-title"
        >
          <h2 id="media-overview-title">Sinopsis</h2>
          <p className="media-detail-overview">
            {detail.overview || "Sinopsis no disponible."}
          </p>
        </section>
        {detail.mediaType === MediaType.MOVIE && (
          <MovieRatingSection tmdbId={detail.tmdbId} />
        )}
        <MediaWatchProviders providers={detail.watchProviders} />
        <MediaTrailer title={detail.title} videos={detail.videos} />
        <MediaCast cast={detail.cast} />
        {detail.mediaType === MediaType.TV && (
          <MediaSeasons seasons={detail.seasons} />
        )}
        <MediaAdditionalInfo detail={detail} />
      </div>
    </section>
  );
}
