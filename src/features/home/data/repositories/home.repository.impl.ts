import type { HomeContent } from "../../domain/entities/home.content";
import type { HomeRepository } from "../../domain/repositories/home.repository";
import { HomeError } from "../errors/home.errors";
import { NetworkException, ServerException } from "../errors/home.exceptions";
import type { HomeRemoteSource } from "../source/home.remote.source";

export class HomeRepositoryImpl implements HomeRepository {
  constructor(private readonly remoteSource: HomeRemoteSource) {}
  // ---------- peliculas ----------
  async getNowPlayingMovies(): Promise<HomeContent[]> {
    try {
      // 1. obtener las peliculas en cartelera
      const movies = await this.remoteSource.getNowPlayingMovies();

      // 2. devolver peliculas domain
      return movies.map((movie) => movie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getPopularMovies(): Promise<HomeContent[]> {
    try {
      const movies = await this.remoteSource.getPopularMovies();

      return movies.map((movie) => movie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getTopRatedMovies(): Promise<HomeContent[]> {
    try {
      const movies = await this.remoteSource.getTopRatedMovies();

      return movies.map((movie) => movie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getUpcomingMovies(): Promise<HomeContent[]> {
    try {
      const movies = await this.remoteSource.getUpcomingMovies();

      return movies.map((movie) => movie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  // ---------- series ----------
  async getOnTheAir(): Promise<HomeContent[]> {
    try {
      const series = await this.remoteSource.getOnTheAir();

      return series.map((serie) => serie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getPopularTv(): Promise<HomeContent[]> {
    try {
      const series = await this.remoteSource.getPopularTv();

      return series.map((serie) => serie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getTopRatedTv(): Promise<HomeContent[]> {
    try {
      const series = await this.remoteSource.getTopRatedTv();

      return series.map((serie) => serie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }
  async getDiscoverTv(): Promise<HomeContent[]> {
    try {
      const series = await this.remoteSource.getDiscoverTv();

      return series.map((serie) => serie.toDomain());
    } catch (e) {
      if (e instanceof HomeError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  // ---- helper ----
  mapError(e: HomeError) {
    let statusCode = e.status;

    switch (statusCode) {
      case 502:
        throw new ServerException();
      default:
        throw new NetworkException();
    }
  }
}
