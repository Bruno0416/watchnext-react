import { asFunction } from "awilix";
import type { ContentService } from "../../mock/content/content.service";
import { MediaLocalSourceImpl } from "../../../features/media/data/source/media.local.source.impl";
import type { MediaLocalSource } from "../../../features/media/data/source/media.local.source";
import { MediaRepositoryImpl } from "../../../features/media/data/repositories/media.repository.impl";
import type { MediaRepository } from "../../../features/media/domain/repositories/media.repository";
import { GetMediaDetail } from "../../../features/media/domain/usecases/get.media.detail";
import type { FeedbackService } from "../../mock/feedback/feedback.service";
import type { MovieRatingLocalSource } from "../../../features/media/data/source/movie.rating.local.source";
import { MovieRatingLocalSourceImpl } from "../../../features/media/data/source/movie.rating.local.source.impl";
import type { MovieRatingRepository } from "../../../features/media/domain/repositories/movie.rating.repository";
import { MovieRatingRepositoryImpl } from "../../../features/media/data/repositories/movie.rating.repository.impl";
import { GetMyMovieRating } from "../../../features/media/domain/usecases/get.my.movie.rating";
import { CreateMovieRating } from "../../../features/media/domain/usecases/create.movie.rating";
import { DeleteMovieRating } from "../../../features/media/domain/usecases/delete.movie.rating";

export const mediaFeatureDi = {
  // ---------- origen de datos ----------
  mediaSource: asFunction(
    ({ contentService }: { contentService: ContentService }) =>
      new MediaLocalSourceImpl(contentService),
  ).singleton(),

  // ---------- repositorio ----------
  mediaRepository: asFunction(
    ({ mediaSource }: { mediaSource: MediaLocalSource }) =>
      new MediaRepositoryImpl(mediaSource),
  ).singleton(),

  // ---------- caso de uso ----------
  getMediaDetail: asFunction(
    ({ mediaRepository }: { mediaRepository: MediaRepository }) =>
      new GetMediaDetail(mediaRepository),
  ).singleton(),

  // ---------- valoraciones de peliculas ----------
  movieRatingSource: asFunction(
    ({ feedbackService }: { feedbackService: FeedbackService }) =>
      new MovieRatingLocalSourceImpl(feedbackService),
  ).singleton(),

  movieRatingRepository: asFunction(
    ({ movieRatingSource }: { movieRatingSource: MovieRatingLocalSource }) =>
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
