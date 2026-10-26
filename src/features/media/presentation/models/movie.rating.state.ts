import type { MovieRating } from "../../domain/entities/movie.rating";

export type MovieRatingState = {
  status: "loading" | "ready" | "error";
  rating: MovieRating | null;
  score: number;
  pending: boolean;
  error: string | null;
  notice: string | null;
};

export const initialMovieRatingState: MovieRatingState = {
  status: "loading",
  rating: null,
  score: 5,
  pending: false,
  error: null,
  notice: null,
};
