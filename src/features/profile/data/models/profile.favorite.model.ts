import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { ProfileFavorite } from "../../domain/entities/profile.favorite";

// el User Service guarda MOVIE / TV en mayuscula, el core usa movie / tv
function toMediaType(value: unknown): MediaType {
  return String(value ?? "").toUpperCase() === "MOVIE"
    ? MediaType.MOVIE
    : MediaType.TV;
}

export class ProfileFavoriteModel {
  constructor(
    public readonly tmdbId: number,
    public readonly mediaType: string,
    public readonly title: string,
    public readonly posterPath: string | null,
    public readonly voteAverage: number,
    public readonly releaseDate: string | null,
  ) {}

  static fromJson(json: JsonObject): ProfileFavoriteModel {
    return new ProfileFavoriteModel(
      Number(json.tmdbId),
      String(json.mediaType ?? "").toUpperCase(),
      String(json.title ?? ""),
      typeof json.posterPath === "string" && json.posterPath ? json.posterPath : null,
      typeof json.voteAverage === "number" ? json.voteAverage : 0,
      typeof json.releaseDate === "string" && json.releaseDate ? json.releaseDate : null,
    );
  }

  static fromDomain(f: ProfileFavorite): ProfileFavoriteModel {
    return new ProfileFavoriteModel(
      f.tmdbId,
      f.mediaType.toUpperCase(),
      f.title,
      f.posterPath,
      f.voteAverage,
      f.releaseDate,
    );
  }

  // lo que le mando al servicio: solo lo que identifica al favorito y su orden
  toJson(position: number): JsonObject {
    return {
      tmdbId: this.tmdbId,
      mediaType: this.mediaType,
      title: this.title,
      posterPath: this.posterPath,
      voteAverage: this.voteAverage,
      releaseDate: this.releaseDate,
      position,
    };
  }

  toDomain(): ProfileFavorite {
    return new ProfileFavorite({
      tmdbId: this.tmdbId,
      mediaType: toMediaType(this.mediaType),
      title: this.title,
      posterPath: this.posterPath,
      voteAverage: this.voteAverage,
      releaseDate: this.releaseDate,
    });
  }
}
