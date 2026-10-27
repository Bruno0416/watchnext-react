// las rutas de poster vienen sin dominio, aca les pongo el de tmdb
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type PosterImageProps = {
  posterPath: string | null;
  size?: "w185" | "w342";
  className?: string;
};

export function PosterImage({
  posterPath,
  size = "w342",
  className = "",
}: PosterImageProps) {
  // sin poster muestro un cuadro con icono para que no quede el hueco
  if (!posterPath) {
    return (
      <div className={`lists poster placeholder ${className}`.trim()} aria-hidden="true">
        <i className="bi bi-film" />
      </div>
    );
  }

  return (
    <img
      className={`lists poster ${className}`.trim()}
      src={`${TMDB_IMAGE_BASE}/${size}${posterPath}`}
      alt=""
      loading="lazy"
    />
  );
}
