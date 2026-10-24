import type { HomeState } from "../models/home.state";
import { ContentCarousel } from "../components/organisms/content.carousel";
import { HeroCarousel } from "../components/organisms/hero.carousel";

import "./style/home.page.css";
import { useHomeViewModel } from "../viewmodels/home.viewmodel";
import { container } from "../../../../core/di/container";
import type { GetNowPlayingMovies } from "../../domain/usecases/movies/get.now.playing.movies";
import type { GetPopularMovies } from "../../domain/usecases/movies/get.popular.movies";
import type { GetTopRatedMovies } from "../../domain/usecases/movies/get.top.rated.movies";
import type { GetUpcomingMovies } from "../../domain/usecases/movies/get.upcoming.movies";
import type { GetDiscoverTv } from "../../domain/usecases/tv/get.discover.tv";
import type { GetOnTheAirTv } from "../../domain/usecases/tv/get.on.the.air.tv";
import type { GetPopularTv } from "../../domain/usecases/tv/get.popular.tv";
import type { GetTopRatedTv } from "../../domain/usecases/tv/get.top.rated.tv";

type HomeSectionKey = keyof HomeState;

const sections: ReadonlyArray<{
  key: HomeSectionKey;
  id: string;
  title: string;
}> = [
  { key: "popular", id: "popular-movies", title: "Películas populares" },
  { key: "nowPlaying", id: "now-playing", title: "Ahora en cines" },
  {
    key: "topRated",
    id: "top-rated-movies",
    title: "Películas mejor valoradas",
  },
  { key: "upcoming", id: "upcoming", title: "Próximamente" },
  { key: "popularTv", id: "popular-series", title: "Series populares" },
  { key: "onTheAir", id: "on-the-air", title: "En emisión" },
  {
    key: "topRatedTv",
    id: "top-rated-series",
    title: "Series mejor valoradas",
  },
  { key: "discoverTv", id: "discover-tv", title: "Descubrir series" },
];

export function HomePage() {
  // ---------- dependencias de peliculas ----------
  const getNowPlayingMovies = container.resolve<GetNowPlayingMovies>(
    "getNowPlayingMovies",
  );

  const getPopularMovies =
    container.resolve<GetPopularMovies>("getPopularMovies");

  const getTopRatedMovies =
    container.resolve<GetTopRatedMovies>("getTopRatedMovies");

  const getUpcomingMovies =
    container.resolve<GetUpcomingMovies>("getUpcomingMovies");

  // ---------- dependencias de series ----------
  const getDiscoverTv = container.resolve<GetDiscoverTv>("getDiscoverTv");

  const getOnTheAirTv = container.resolve<GetOnTheAirTv>("getOnTheAirTv");

  const getPopularTv = container.resolve<GetPopularTv>("getPopularTv");

  const getTopRatedTv = container.resolve<GetTopRatedTv>("getTopRatedTv");

  // ---------- viewmodel ----------
  const { state } = useHomeViewModel(
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getDiscoverTv,
    getOnTheAirTv,
    getPopularTv,
    getTopRatedTv,
  );

  return (
    <section
      id="home-view"
      className="home-view"
      aria-label="Inicio de WatchNext"
    >
      <HeroCarousel items={state.popular.items} />

      <div className="container-fluid home-container home-catalog">
        {sections.map((section) => (
          <ContentCarousel
            key={section.id}
            id={section.id}
            title={section.title}
            state={state[section.key]}
          />
        ))}
      </div>
    </section>
  );
}
