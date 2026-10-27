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
    const response = json as unknown as RawMediaDetail;
    const details = response.details;
    const common = {
      tmdbId: details.id,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      voteAverage: details.vote_average,
      genres: details.genres.map((genre) => genre.name),
      cast: details.cast,
      videos: details.videos,
      watchProviders: response.watchProviders,
      imdbId: details.external_ids.imdb_id,
      keywords: details.keywords.map((keyword) => keyword.name),
      alternativeTitles: details.alternative_titles.map((title) => title.title),
    };

    if (response.mediaType === "MOVIE") {
      return new MediaDetailModel({
        ...common,
        mediaType: MediaType.MOVIE,
        title: response.details.title,
        releaseDate: response.details.release_date,
        voteCount: response.details.vote_count,
        originalTitle: response.details.original_title,
        runtimeMinutes: response.details.runtime,
        directors: response.details.directors,
      });
    }

    return new MediaDetailModel({
      ...common,
      mediaType: MediaType.TV,
      title: response.details.name,
      releaseDate: response.details.first_air_date,
      voteCount: null,
      status: response.details.status,
      numberOfSeasons: response.details.number_of_seasons,
      numberOfEpisodes: response.details.number_of_episodes,
      createdBy: response.details.created_by,
      seasons: response.details.seasons,
    });
  }

  toDomain(): MediaDetail {
    return this.detail;
  }
}
