import { MovieRatingError } from "../errors/movie.rating.error";
import type { MovieRatingRepository } from "../repositories/movie.rating.repository";

export class CreateMovieRating {
  constructor(private readonly repository: MovieRatingRepository) {}

  call(tmdbId: number, score: number) {
    // 1. comprobar los datos antes de crear la valoracion
    if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0 || !Number.isInteger(score) || score < 1 || score > 10) {
      throw new MovieRatingError("INVALID_RATING");
    }
    return this.repository.createRating(tmdbId, score);
  }
}
