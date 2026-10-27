import type { NewsArticle } from "../entities/news.article";

// aca solo leo, lo de crear y borrar va en news-management (HU 14)
export interface NewsRepository {
  // todas las noticias, la mas nueva primero
  getAll(): Promise<NewsArticle[]>;

  // una por id, si no esta tira NewsNotFoundException
  getById(id: string): Promise<NewsArticle>;
}
