import { getMediaImageUrl } from "../../../../../core/ui/utils/media.image";

type MediaArtworkVariant = "poster" | "person" | "season";

type MediaArtworkProps = {
  path: string | null;
  alt: string;
  variant: MediaArtworkVariant;
};

export function MediaArtwork({ path, alt, variant }: MediaArtworkProps) {
  const image = getMediaImageUrl(path, "w342");
  if (image) {
    return (
      <img
        className={variant === "poster" ? "media-detail-poster" : undefined}
        src={image}
        alt={alt}
        loading={variant === "poster" ? undefined : "lazy"}
      />
    );
  }

  const icon =
    variant === "poster"
      ? "bi-film"
      : variant === "person"
        ? "bi-person"
        : "bi-collection-play";

  return (
    <div className={`media-detail-${variant}-placeholder`}>
      <i className={`bi ${icon}`} aria-hidden="true" />
    </div>
  );
}
