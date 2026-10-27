import type { NewsArticle } from "../entities/news.article";
import type { NewsRepository } from "../repositories/news.repository";

export class GetNews {
  constructor(private readonly repo: NewsRepository) {}

  async call(): Promise<NewsArticle[]> {
    return this.repo.getAll();
  }
}
