import type { NewsArticleModel } from "../models/news.article.model";

// hoy es el mock, despues sera el News Service de verdad
export interface NewsLocalSource {
  getAll(): Promise<NewsArticleModel[]>;
  getById(id: string): Promise<NewsArticleModel>;
}
