export type MovieRatingErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_RATING"
  | "DUPLICATE_RATING"
  | "RATING_NOT_FOUND"
  | "FORBIDDEN"
  | "UNKNOWN";

const messages: Record<MovieRatingErrorCode, string> = {
  UNAUTHENTICATED: "Inicia sesión para valorar esta película.",
  INVALID_RATING: "Selecciona una puntuación entre 1 y 10.",
  DUPLICATE_RATING: "Ya has valorado esta película.",
  RATING_NOT_FOUND: "La valoración ya no existe. Recarga la página.",
  FORBIDDEN: "No puedes eliminar la valoración de otro usuario.",
  UNKNOWN: "No se pudo completar la operación. Inténtalo de nuevo.",
};

export class MovieRatingError extends Error {
  constructor(public readonly code: MovieRatingErrorCode) {
    super(messages[code]);
    this.name = "MovieRatingError";
  }
}
