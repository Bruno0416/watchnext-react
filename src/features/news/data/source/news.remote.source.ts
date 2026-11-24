import type { NewsArticleModel } from "../models/news.article.model";

// contrato con el news-service
export interface NewsRemoteSource {
  getAll(): Promise<NewsArticleModel[]>;
  getById(id: string): Promise<NewsArticleModel>;
}
