import type { MovieRatingRepository } from "../repositories/movie.rating.repository";

export class DeleteMovieRating {
  constructor(private readonly repository: MovieRatingRepository) {}

  call(id: string) {
    return this.repository.deleteRating(id);
  }
}
