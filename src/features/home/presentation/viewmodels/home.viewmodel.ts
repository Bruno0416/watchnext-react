import { useEffect, useState } from "react";

import type { HomeContent } from "../../domain/entities/home.content";
import type { GetNowPlayingMovies } from "../../domain/usecases/movies/get.now.playing.movies";
import type { GetPopularMovies } from "../../domain/usecases/movies/get.popular.movies";
import type { GetTopRatedMovies } from "../../domain/usecases/movies/get.top.rated.movies";
import type { GetUpcomingMovies } from "../../domain/usecases/movies/get.upcoming.movies";
import type { GetDiscoverTv } from "../../domain/usecases/tv/get.discover.tv";
import type { GetOnTheAirTv } from "../../domain/usecases/tv/get.on.the.air.tv";
import type { GetPopularTv } from "../../domain/usecases/tv/get.popular.tv";
import type { GetTopRatedTv } from "../../domain/usecases/tv/get.top.rated.tv";

import { initialHomeState, type HomeState } from "../models/home.state";

export function useHomeViewModel(
  getNowPlayingMovies: GetNowPlayingMovies,
  getPopularMovies: GetPopularMovies,
  getTopRatedMovies: GetTopRatedMovies,
  getUpcomingMovies: GetUpcomingMovies,
  getDiscoverTv: GetDiscoverTv,
  getOnTheAirTv: GetOnTheAirTv,
  getPopularTv: GetPopularTv,
  getTopRatedTv: GetTopRatedTv,
) {
  // ---------- estado ----------
  const [state, setState] = useState<HomeState>(initialHomeState);

  // ---------- carga inicial ----------
  useEffect(() => {
    let active = true;

    // --- cargar seccion independiente ---
    async function loadSection(
      section: keyof HomeState,
      request: () => Promise<HomeContent[]>,
    ): Promise<void> {
      // 1. activar carga de la seccion
      setState((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          isLoading: true,
          error: null,
        },
      }));

      try {
        // 2. ejecutar peticion
        const items = await request();

        if (!active) return;

        // 3. actualizar solamente la seccion
        setState((prev) => ({
          ...prev,
          [section]: {
            items,
            isLoading: false,
            error: null,
          },
        }));
      } catch (error) {
        if (!active) return;

        // 4. guardar error de la seccion
        setState((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "No se pudo cargar el contenido",
          },
        }));
      }
    }

    // ---------- peliculas ----------
    void loadSection("nowPlaying", () => getNowPlayingMovies.call());
    void loadSection("popular", () => getPopularMovies.call());
    void loadSection("topRated", () => getTopRatedMovies.call());
    void loadSection("upcoming", () => getUpcomingMovies.call());

    // ---------- series ----------
    void loadSection("onTheAir", () => getOnTheAirTv.call());
    void loadSection("popularTv", () => getPopularTv.call());
    void loadSection("topRatedTv", () => getTopRatedTv.call());
    void loadSection("discoverTv", () => getDiscoverTv.call());

    return () => {
      active = false;
    };
  }, [
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getOnTheAirTv,
    getPopularTv,
    getTopRatedTv,
    getDiscoverTv,
  ]);

  return { state };
}
