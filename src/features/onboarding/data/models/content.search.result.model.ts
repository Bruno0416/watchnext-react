import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { ContentSearchResult } from "../../domain/entities/content.search.result";

export class ContentSearchResultModel {
  constructor(
    public readonly tmdbId: number,
    public readonly title: string,
    public readonly overview: string,
    public readonly posterPath: string,
    public readonly mediaType: MediaType,
    public readonly year: number | null,
    public readonly popularity: number,
    public readonly voteAverage: number,
  ) {}

  static fromJson(json: JsonObject): ContentSearchResultModel {
    return new ContentSearchResultModel(
      Number(json.tmdbId ?? 0),
      String(json.title ?? ""),
      String(json.overview ?? ""),
      String(json.posterPath ?? ""),
      json.mediaType === "tv" ? MediaType.TV : MediaType.MOVIE,
      typeof json.year === "number" ? json.year : null,
      Number(json.popularity ?? 0),
      Number(json.voteAverage ?? 0),
    );
  }

  toDomain(): ContentSearchResult {
    return new ContentSearchResult({
      tmdbId: this.tmdbId,
      title: this.title,
      overview: this.overview,
      posterPath: this.posterPath,
      mediaType: this.mediaType,
      year: this.year,
      popularity: this.popularity,
      voteAverage: this.voteAverage,
    });
  }
}
