type MediaTypeChipProps = {
  isMovie: boolean;
};

// chip chico para distinguir pelicula de serie en las tarjetas
export function MediaTypeChip({ isMovie }: MediaTypeChipProps) {
  return (
    <span className="lists chip">
      <i className={`bi bi-${isMovie ? "film" : "tv"}`} aria-hidden="true" />
      {isMovie ? "Pelicula" : "Serie"}
    </span>
  );
}
