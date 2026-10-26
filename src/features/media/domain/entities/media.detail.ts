import { MediaType } from "../../../../core/models/media.type";

export type MediaPerson = {
  id: number;
  name: string;
  profilePath: string | null;
  character?: string;
};

export type MediaVideo = {
  key: string;
  name: string;
  type: string;
  official: boolean;
};

export type MediaProvider = {
  name: string;
  iconLight: string | null;
  iconDark: string | null;
  link: string;
};

export type MediaSeason = {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeCount: number;
  posterPath: string | null;
};

type CommonMediaDetail = {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  genres: string[];
  cast: MediaPerson[];
  videos: MediaVideo[];
  watchProviders: MediaProvider[];
  imdbId: string | null;
  keywords: string[];
  alternativeTitles: string[];
};

export type MovieDetail = CommonMediaDetail & {
  mediaType: MediaType.MOVIE;
  originalTitle: string | null;
  runtimeMinutes: number | null;
  directors: MediaPerson[];
};

export type TvDetail = CommonMediaDetail & {
  mediaType: MediaType.TV;
  status: string | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  createdBy: MediaPerson[];
  seasons: MediaSeason[];
};

export type MediaDetail = MovieDetail | TvDetail;
