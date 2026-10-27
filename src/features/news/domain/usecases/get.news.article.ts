import type { NewsArticle } from "../entities/news.article";
import type { NewsRepository } from "../repositories/news.repository";

export class GetNewsArticle {
  constructor(private readonly repo: NewsRepository) {}

  async call(id: string): Promise<NewsArticle> {
    return this.repo.getById(id);
  }
}
