import type { MovieRating } from "../entities/movie.rating";

export interface MovieRatingRepository {
  getMyRating(tmdbId: number): Promise<MovieRating | null>;
  createRating(tmdbId: number, score: number): Promise<MovieRating>;
  deleteRating(id: string): Promise<void>;
}
