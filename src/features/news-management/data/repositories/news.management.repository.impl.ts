import type { ManagedNews, NewsDraft } from "../../domain/entities/managed.news";
import type { NewsManagementRepository } from "../../domain/repositories/news.management.repository";
import { NewsManagementError } from "../errors/news.management.errors";
import {
  NewsManagementUnavailableException,
  NewsNotFoundForEditException,
} from "../errors/news.management.exceptions";
import { ManagedNewsModel } from "../models/managed.news.model";
import type { NewsManagementLocalSource } from "../source/news.management.local.source";

export class NewsManagementRepositoryImpl implements NewsManagementRepository {
  constructor(private readonly source: NewsManagementLocalSource) {}

  async getAll(): Promise<ManagedNews[]> {
    try {
      const models = await this.source.getAll();
      // la mas nueva primero, igual que en la consulta publica
      return models
        .map((m) => m.toDomain())
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async create(draft: NewsDraft): Promise<ManagedNews> {
    try {
      // al crear, la fecha de publicacion es ahora
      const json = ManagedNewsModel.draftToJson(draft, new Date().toISOString());
      return (await this.source.create(json)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async update(id: string, draft: NewsDraft): Promise<ManagedNews> {
    try {
      // al editar no cambio la fecha de publicacion
      return (await this.source.update(id, ManagedNewsModel.draftToJson(draft))).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.source.delete(id);
    } catch (e) {
      throw this.mapError(e);
    }
  }

  // ---- helper ----
  private mapError(e: unknown): Error {
    if (e instanceof NewsManagementError && e.status === 404) return new NewsNotFoundForEditException();
    console.error(e);
    return new NewsManagementUnavailableException();
  }
}
