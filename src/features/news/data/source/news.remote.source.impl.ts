import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { NewsError } from "../errors/news.errors";
import { NewsArticleModel } from "../models/news.article.model";
import type { NewsLocalSource } from "./news.local.source";

export class NewsRemoteSourceImpl implements NewsLocalSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de noticias
      if (error instanceof ApiHttpError) throw new NewsError(error.status);
      if (error instanceof TypeError) throw new NewsError(0);
      throw error;
    }
  }

  async getAll(): Promise<NewsArticleModel[]> {
    // 1. leer noticias es publico, no necesita sesion
    const json = await this.request(() => apiJson<JsonArray>("/api/v1/news"));
    return json.map((item) => NewsArticleModel.fromJson(item));
  }

  async getById(id: string): Promise<NewsArticleModel> {
    const json = await this.request(() =>
      apiJson<JsonObject>(`/api/v1/news/${encodeURIComponent(id)}`),
    );
    return NewsArticleModel.fromJson(json);
  }
}
