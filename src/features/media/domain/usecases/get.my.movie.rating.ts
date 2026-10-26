import type { MovieRatingRepository } from "../repositories/movie.rating.repository";

export class GetMyMovieRating {
  constructor(private readonly repository: MovieRatingRepository) {}

  call(tmdbId: number) {
    return this.repository.getMyRating(tmdbId);
  }
}
