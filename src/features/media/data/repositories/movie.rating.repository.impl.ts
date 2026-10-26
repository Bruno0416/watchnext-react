import { FeedbackRatingError } from "../../../../core/mock/feedback/feedback.rating.error";
import type { MovieRating } from "../../domain/entities/movie.rating";
import { MovieRatingError } from "../../domain/errors/movie.rating.error";
import type { MovieRatingRepository } from "../../domain/repositories/movie.rating.repository";
import type { MovieRatingLocalSource } from "../source/movie.rating.local.source";

export class MovieRatingRepositoryImpl implements MovieRatingRepository {
  constructor(private readonly source: MovieRatingLocalSource) {}

  private translateError(error: unknown): MovieRatingError {
    return error instanceof FeedbackRatingError
      ? new MovieRatingError(error.code)
      : new MovieRatingError("UNKNOWN");
  }

  async getMyRating(tmdbId: number): Promise<MovieRating | null> {
    try {
      return (await this.source.getMyRating(tmdbId))?.toDomain() ?? null;
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async createRating(tmdbId: number, score: number): Promise<MovieRating> {
    try {
      return (await this.source.createRating(tmdbId, score)).toDomain();
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async deleteRating(id: string): Promise<void> {
    try {
      await this.source.deleteRating(id);
    } catch (error) {
      throw this.translateError(error);
    }
  }
}
