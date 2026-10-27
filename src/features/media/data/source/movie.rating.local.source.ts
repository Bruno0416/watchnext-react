import type { MovieRatingModel } from "../models/movie.rating.model";

export interface MovieRatingLocalSource {
  getMyRating(tmdbId: number): Promise<MovieRatingModel | null>;
  createRating(tmdbId: number, score: number): Promise<MovieRatingModel>;
  deleteRating(id: string): Promise<void>;
}
