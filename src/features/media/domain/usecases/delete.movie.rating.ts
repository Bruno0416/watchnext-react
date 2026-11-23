import type { MovieRatingRepository } from "../repositories/movie.rating.repository";

export class DeleteMovieRating {
  constructor(private readonly repository: MovieRatingRepository) {}

  call(tmdbId: number) {
    return this.repository.deleteRating(tmdbId);
  }
}
