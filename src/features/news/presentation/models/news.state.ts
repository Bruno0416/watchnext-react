import type { NewsArticle } from "../../domain/entities/news.article";

// estado del listado
export type NewsListState = {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
};

export const initialNewsListState: NewsListState = {
  articles: [],
  isLoading: true,
  error: null,
};

// estado del detalle
export type NewsDetailState = {
  article: NewsArticle | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
};

export const initialNewsDetailState: NewsDetailState = {
  article: null,
  isLoading: true,
  notFound: false,
  error: null,
};
