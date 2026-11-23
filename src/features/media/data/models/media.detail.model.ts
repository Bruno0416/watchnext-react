import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import type {
  MediaDetail,
  MediaPerson,
  MediaProvider,
  MediaSeason,
  MediaVideo,
} from "../../domain/entities/media.detail";

type RawCommon = {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: { name: string }[];
  cast: MediaPerson[];
  videos: MediaVideo[];
  external_ids: { imdb_id: string | null };
  keywords: { name: string }[];
  alternative_titles: { title: string }[];
};

type RawMovie = RawCommon & {
  title: string;
  original_title: string;
  release_date: string;
  runtime: number;
  vote_count: number;
  directors: MediaPerson[];
};

type RawTv = RawCommon & {
  name: string;
  first_air_date: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  created_by: MediaPerson[];
  seasons: MediaSeason[];
};

type RawMediaDetail =
  | { mediaType: "MOVIE"; details: RawMovie; watchProviders: MediaProvider[] }
  | { mediaType: "TV"; details: RawTv; watchProviders: MediaProvider[] };

export class MediaDetailModel {
  private constructor(private readonly detail: MediaDetail) {}

  static fromJson(json: JsonObject): MediaDetailModel {
    // 1. reunir los atributos comunes de peliculas y series
    const response = json as unknown as RawMediaDetail;
    const details = response.details;
    const common = {
      tmdbId: details.id,
      overview: details.overview ?? "",
      posterPath: details.poster_path ?? null,
      backdropPath: details.backdrop_path ?? null,
      voteAverage: details.vote_average ?? null,
      genres: (details.genres ?? []).map((genre) => genre.name),
      cast: details.cast ?? [],
      videos: details.videos ?? [],
      watchProviders: response.watchProviders ?? [],
      imdbId: details.external_ids?.imdb_id ?? null,
      keywords: (details.keywords ?? []).map((keyword) => keyword.name),
      alternativeTitles: (details.alternative_titles ?? []).map((title) => title.title),
    };

    // 2. completar los atributos especificos de peliculas
    if (response.mediaType === "MOVIE") {
      return new MediaDetailModel({
        ...common,
        mediaType: MediaType.MOVIE,
        title: response.details.title,
        releaseDate: response.details.release_date ?? null,
        voteCount: response.details.vote_count ?? null,
        originalTitle: response.details.original_title ?? null,
        runtimeMinutes: response.details.runtime ?? null,
        directors: response.details.directors ?? [],
      });
    }

    // 3. completar los atributos especificos de series
    return new MediaDetailModel({
      ...common,
      mediaType: MediaType.TV,
      title: response.details.name,
      releaseDate: response.details.first_air_date ?? null,
      voteCount: null,
      status: response.details.status ?? null,
      numberOfSeasons: response.details.number_of_seasons ?? null,
      numberOfEpisodes: response.details.number_of_episodes ?? null,
      createdBy: response.details.created_by ?? [],
      seasons: response.details.seasons ?? [],
    });
  }

  toDomain(): MediaDetail {
    return this.detail;
  }
}
