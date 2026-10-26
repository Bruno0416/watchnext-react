import type { FeedbackService } from "../../../../core/mock/feedback/feedback.service";
import { MovieRatingModel } from "../models/movie.rating.model";
import type { MovieRatingLocalSource } from "./movie.rating.local.source";

export class MovieRatingLocalSourceImpl implements MovieRatingLocalSource {
  constructor(private readonly service: FeedbackService) {}

  async getMyRating(tmdbId: number): Promise<MovieRatingModel | null> {
    const json = await this.service.getMyRating(tmdbId);
    return json ? MovieRatingModel.fromJson(json) : null;
  }

  async createRating(tmdbId: number, score: number): Promise<MovieRatingModel> {
    const json = await this.service.createRating({
      tmdbId,
      mediaType: "MOVIE",
      score,
    });
    return MovieRatingModel.fromJson(json);
  }

  async deleteRating(id: string): Promise<void> {
    await this.service.deleteRating(id);
  }
}
