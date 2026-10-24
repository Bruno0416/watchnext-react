import type { HomeContentModel } from "../models/home.content.model";

export interface HomeLocalSource {
  // ---------- peliculas ----------
  getNowPlayingMovies(): Promise<HomeContentModel[]>;
  getPopularMovies(): Promise<HomeContentModel[]>;
  getTopRatedMovies(): Promise<HomeContentModel[]>;
  getUpcomingMovies(): Promise<HomeContentModel[]>;

  // ---------- series ----------
  getOnTheAir(): Promise<HomeContentModel[]>;
  getPopularTv(): Promise<HomeContentModel[]>;
  getTopRatedTv(): Promise<HomeContentModel[]>;
  getDiscoverTv(): Promise<HomeContentModel[]>;
}
