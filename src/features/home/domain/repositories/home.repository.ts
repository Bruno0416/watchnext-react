import type { HomeContent } from "../entities/home.content";

export interface HomeRepository {
  // ---------- peliculas ----------
  getNowPlayingMovies(): Promise<HomeContent[]>;
  getPopularMovies(): Promise<HomeContent[]>;
  getTopRatedMovies(): Promise<HomeContent[]>;
  getUpcomingMovies(): Promise<HomeContent[]>;

  // ---------- series ----------
  getOnTheAir(): Promise<HomeContent[]>;
  getPopularTv(): Promise<HomeContent[]>;
  getTopRatedTv(): Promise<HomeContent[]>;
  getDiscoverTv(): Promise<HomeContent[]>;
}
