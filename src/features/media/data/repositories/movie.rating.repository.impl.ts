import type { MovieRating } from "../../domain/entities/movie.rating";
import { MovieRatingError } from "../../domain/errors/movie.rating.error";
import type { MovieRatingRepository } from "../../domain/repositories/movie.rating.repository";
import type { MovieRatingRemoteSource } from "../source/movie.rating.remote.source";

export class MovieRatingRepositoryImpl implements MovieRatingRepository {
  constructor(private readonly source: MovieRatingRemoteSource) {}

  // --- traducir errores del origen de datos ---
  private translateError(error: unknown): MovieRatingError {
    return error instanceof MovieRatingError ? error : new MovieRatingError("UNKNOWN");
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

  async deleteRating(tmdbId: number): Promise<void> {
    try {
      await this.source.deleteRating(tmdbId);
    } catch (error) {
      throw this.translateError(error);
    }
  }
}
