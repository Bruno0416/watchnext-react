import type { NewsArticle } from "../../domain/entities/news.article";
import type { NewsRepository } from "../../domain/repositories/news.repository";
import { NewsError } from "../errors/news.errors";
import {
  NewsNotFoundException,
  NewsUnavailableException,
} from "../errors/news.exceptions";
import type { NewsLocalSource } from "../source/news.local.source";

export class NewsRepositoryImpl implements NewsRepository {
  constructor(private readonly source: NewsLocalSource) {}

  async getAll(): Promise<NewsArticle[]> {
    try {
      // traigo los modelos del source
      const models = await this.source.getAll();

      // los paso a dominio y ordeno, la mas nueva primero
      return models
        .map((model) => model.toDomain())
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async getById(id: string): Promise<NewsArticle> {
    try {
      const model = await this.source.getById(id);
      return model.toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  // ---- helper ----
  // paso el error pelado a una excepcion que la vista entienda
  private mapError(e: unknown): Error {
    if (e instanceof NewsError && e.status === 404) {
      return new NewsNotFoundException();
    }

    console.error(e);
    return new NewsUnavailableException();
  }
}
