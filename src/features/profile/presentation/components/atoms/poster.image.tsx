// las rutas de poster vienen sin dominio, aca les pongo el de tmdb
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type PosterImageProps = {
  posterPath: string | null;
  className?: string;
};

export function PosterImage({ posterPath, className = "" }: PosterImageProps) {
  if (!posterPath) {
    return (
      <div className={`profile poster placeholder ${className}`.trim()} aria-hidden="true">
        <i className="bi bi-film" />
      </div>
    );
  }

  return (
    <img
      className={`profile poster ${className}`.trim()}
      src={`${TMDB_IMAGE_BASE}/w342${posterPath}`}
      alt=""
      loading="lazy"
    />
  );
}
