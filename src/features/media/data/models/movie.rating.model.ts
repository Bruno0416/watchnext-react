import type { JsonObject } from "../../../../core/mock/json.types";
import type { MovieRating } from "../../domain/entities/movie.rating";

export class MovieRatingModel {
  private constructor(private readonly rating: MovieRating) {}

  static fromJson(json: JsonObject): MovieRatingModel {
    return new MovieRatingModel({
      id: json.id as string,
      tmdbId: json.tmdbId as number,
      score: json.score as number,
    });
  }

  toDomain(): MovieRating {
    return this.rating;
  }
}
