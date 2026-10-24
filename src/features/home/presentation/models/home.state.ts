import type { HomeContent } from "../../domain/entities/home.content";

export type HomeContentState = {
  items: HomeContent[];
  isLoading: boolean;
  error: string | null;
};

export type HomeState = {
  nowPlaying: HomeContentState;
  popular: HomeContentState;
  topRated: HomeContentState;
  upcoming: HomeContentState;
  onTheAir: HomeContentState;
  popularTv: HomeContentState;
  topRatedTv: HomeContentState;
  discoverTv: HomeContentState;
};

export const initialHomeState: HomeState = {
  nowPlaying: { items: [], isLoading: false, error: null },
  popular: { items: [], isLoading: false, error: null },
  topRated: { items: [], isLoading: false, error: null },
  upcoming: { items: [], isLoading: false, error: null },
  onTheAir: { items: [], isLoading: false, error: null },
  popularTv: { items: [], isLoading: false, error: null },
  topRatedTv: { items: [], isLoading: false, error: null },
  discoverTv: { items: [], isLoading: false, error: null },
};
