import { asFunction } from "awilix";
import { MediaRemoteSourceImpl } from "../../../features/media/data/source/media.remote.source.impl";
import type { MediaRemoteSource } from "../../../features/media/data/source/media.remote.source";
import { MediaRepositoryImpl } from "../../../features/media/data/repositories/media.repository.impl";
import type { MediaRepository } from "../../../features/media/domain/repositories/media.repository";
import { GetMediaDetail } from "../../../features/media/domain/usecases/get.media.detail";
import type { MovieRatingRemoteSource } from "../../../features/media/data/source/movie.rating.remote.source";
import { MovieRatingRemoteSourceImpl } from "../../../features/media/data/source/movie.rating.remote.source.impl";
import type { MovieRatingRepository } from "../../../features/media/domain/repositories/movie.rating.repository";
import { MovieRatingRepositoryImpl } from "../../../features/media/data/repositories/movie.rating.repository.impl";
import { GetMyMovieRating } from "../../../features/media/domain/usecases/get.my.movie.rating";
import { CreateMovieRating } from "../../../features/media/domain/usecases/create.movie.rating";
import { DeleteMovieRating } from "../../../features/media/domain/usecases/delete.movie.rating";

export const mediaFeatureDi = {
  // ---------- origen de datos ----------
  mediaSource: asFunction(() => new MediaRemoteSourceImpl()).singleton(),

  // ---------- repositorio ----------
  mediaRepository: asFunction(
    ({ mediaSource }: { mediaSource: MediaRemoteSource }) =>
      new MediaRepositoryImpl(mediaSource),
  ).singleton(),

  // ---------- caso de uso ----------
  getMediaDetail: asFunction(
    ({ mediaRepository }: { mediaRepository: MediaRepository }) =>
      new GetMediaDetail(mediaRepository),
  ).singleton(),

  // ---------- valoraciones de peliculas ----------
  movieRatingSource: asFunction(() => new MovieRatingRemoteSourceImpl()).singleton(),

  movieRatingRepository: asFunction(
    ({ movieRatingSource }: { movieRatingSource: MovieRatingRemoteSource }) =>
      new MovieRatingRepositoryImpl(movieRatingSource),
  ).singleton(),

  getMyMovieRating: asFunction(
    ({ movieRatingRepository }: { movieRatingRepository: MovieRatingRepository }) =>
      new GetMyMovieRating(movieRatingRepository),
  ).singleton(),

  createMovieRating: asFunction(
    ({ movieRatingRepository }: { movieRatingRepository: MovieRatingRepository }) =>
      new CreateMovieRating(movieRatingRepository),
  ).singleton(),

  deleteMovieRating: asFunction(
    ({ movieRatingRepository }: { movieRatingRepository: MovieRatingRepository }) =>
      new DeleteMovieRating(movieRatingRepository),
  ).singleton(),
};
