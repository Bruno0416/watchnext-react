import type { MediaVideo } from "../../../domain/entities/media.detail";

function selectTrailer(videos: MediaVideo[]): MediaVideo | undefined {
  return (
    videos.find((video) => video.type === "Trailer" && video.official) ??
    videos.find((video) => video.type === "Trailer") ??
    videos.find((video) => video.type === "Teaser")
  );
}

export function MediaTrailer({
  videos,
  title,
}: {
  videos: MediaVideo[];
  title: string;
}) {
  const trailer = selectTrailer(videos);
  return (
    <section
      className="media-detail-section"
      aria-labelledby="media-trailer-title"
    >
      <h2 id="media-trailer-title">Tráiler</h2>
      {trailer ? (
        <iframe
          className="media-detail-video"
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
          title={`${trailer.name} - ${title}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <p className="media-detail-empty">Tráiler no disponible.</p>
      )}
    </section>
  );
}
