import { asFunction } from "awilix";

import type { ContentService } from "../../mock/content/content.service";

import { HomeLocalSourceImpl } from "../../../features/home/data/source/home.local.source.impl";
import type { HomeLocalSource } from "../../../features/home/data/source/home.local.source";
import { HomeRepositoryImpl } from "../../../features/home/data/repositories/home.repository.impl";
import type { HomeRepository } from "../../../features/home/domain/repositories/home.repository";

import { GetNowPlayingMovies } from "../../../features/home/domain/usecases/movies/get.now.playing.movies";
import { GetPopularMovies } from "../../../features/home/domain/usecases/movies/get.popular.movies";
import { GetTopRatedMovies } from "../../../features/home/domain/usecases/movies/get.top.rated.movies";
import { GetUpcomingMovies } from "../../../features/home/domain/usecases/movies/get.upcoming.movies";

import { GetDiscoverTv } from "../../../features/home/domain/usecases/tv/get.discover.tv";
import { GetOnTheAirTv } from "../../../features/home/domain/usecases/tv/get.on.the.air.tv";
import { GetPopularTv } from "../../../features/home/domain/usecases/tv/get.popular.tv";
import { GetTopRatedTv } from "../../../features/home/domain/usecases/tv/get.top.rated.tv";

export const homeFeatureDi = {
  // ---------- data source ----------
  homeSource: asFunction(
    ({ contentService }: { contentService: ContentService }) =>
      new HomeLocalSourceImpl(contentService),
  ).singleton(),

  // ---------- repositorio ----------
  homeRepository: asFunction(
    ({ homeSource }: { homeSource: HomeLocalSource }) =>
      new HomeRepositoryImpl(homeSource),
  ).singleton(),

  // ---------- peliculas ----------
  getNowPlayingMovies: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetNowPlayingMovies(homeRepository),
  ).singleton(),

  getPopularMovies: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetPopularMovies(homeRepository),
  ).singleton(),

  getTopRatedMovies: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetTopRatedMovies(homeRepository),
  ).singleton(),

  getUpcomingMovies: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetUpcomingMovies(homeRepository),
  ).singleton(),

  // ---------- series ----------
  getDiscoverTv: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetDiscoverTv(homeRepository),
  ).singleton(),

  getOnTheAirTv: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetOnTheAirTv(homeRepository),
  ).singleton(),

  getPopularTv: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetPopularTv(homeRepository),
  ).singleton(),

  getTopRatedTv: asFunction(
    ({ homeRepository }: { homeRepository: HomeRepository }) =>
      new GetTopRatedTv(homeRepository),
  ).singleton(),
};
