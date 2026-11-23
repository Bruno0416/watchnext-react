import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import { MovieRatingError } from "../../domain/errors/movie.rating.error";
import { MovieRatingModel } from "../models/movie.rating.model";
import type { MovieRatingLocalSource } from "./movie.rating.local.source";

export class MovieRatingRemoteSourceImpl implements MovieRatingLocalSource {
  private params(tmdbId: number): string {
    return new URLSearchParams({ tmdbId: String(tmdbId), mediaType: "MOVIE" }).toString();
  }

  private mapError(error: unknown): never {
    if (error instanceof ApiHttpError) {
      if (error.status === 401) throw new MovieRatingError("UNAUTHENTICATED");
      if (error.status === 403) throw new MovieRatingError("FORBIDDEN");
      if (error.status === 400 || error.status === 422) throw new MovieRatingError("INVALID_RATING");
      if (error.status === 409) throw new MovieRatingError("DUPLICATE_RATING");
    }
    throw new MovieRatingError("UNKNOWN");
  }

  async getMyRating(tmdbId: number): Promise<MovieRatingModel | null> {
    try {
      const json = await apiJson<Record<string, unknown>>(
        `/api/v1/feedback/ratings?${this.params(tmdbId)}`,
        { auth: "required" },
      );
      return MovieRatingModel.fromJson(json);
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 404) return null;
      return this.mapError(error);
    }
  }

  async createRating(tmdbId: number, score: number): Promise<MovieRatingModel> {
    try {
      // 1. crear la valoracion en el backend
      await apiVoid("/api/v1/feedback/ratings/create", {
        method: "POST",
        auth: "required",
        body: JSON.stringify({ tmdbId, mediaType: "MOVIE", score }),
      });
      // 2. consultar la valoracion creada porque la respuesta no tiene cuerpo
      const rating = await this.getMyRating(tmdbId);
      if (!rating) throw new MovieRatingError("RATING_NOT_FOUND");
      return rating;
    } catch (error) {
      if (error instanceof MovieRatingError) throw error;
      return this.mapError(error);
    }
  }

  async deleteRating(tmdbId: number): Promise<void> {
    try {
      await apiVoid(`/api/v1/feedback/ratings?${this.params(tmdbId)}`, {
        method: "DELETE",
        auth: "required",
      });
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 404) {
        throw new MovieRatingError("RATING_NOT_FOUND");
      }
      this.mapError(error);
    }
  }
}
