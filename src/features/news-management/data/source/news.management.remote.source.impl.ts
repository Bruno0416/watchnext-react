import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonArray, JsonObject } from "../../../../core/http/json.types";
import { NewsManagementError } from "../errors/news.management.errors";
import { ManagedNewsModel } from "../models/managed.news.model";
import type { NewsManagementRemoteSource } from "./news.management.remote.source";

export class NewsManagementRemoteSourceImpl implements NewsManagementRemoteSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de gestion de noticias
      if (error instanceof ApiHttpError) throw new NewsManagementError(error.status);
      if (error instanceof TypeError) throw new NewsManagementError(0);
      throw error;
    }
  }

  async getAll(): Promise<ManagedNewsModel[]> {
    const json = await this.request(() => apiJson<JsonArray>("/api/v1/news"));
    return json.map((item) => ManagedNewsModel.fromJson(item));
  }

  async create(request: JsonObject): Promise<ManagedNewsModel> {
    // 1. publicar la noticia, el backend exige rol ADMIN
    const json = await this.request(() => apiJson<JsonObject>("/api/v1/news", {
      method: "POST",
      auth: "required",
      body: JSON.stringify(request),
    }));
    return ManagedNewsModel.fromJson(json);
  }

  async update(id: string, request: JsonObject): Promise<ManagedNewsModel> {
    const json = await this.request(() => apiJson<JsonObject>(`/api/v1/news/${encodeURIComponent(id)}`, {
      method: "PUT",
      auth: "required",
      body: JSON.stringify(request),
    }));
    return ManagedNewsModel.fromJson(json);
  }

  delete(id: string): Promise<void> {
    return this.request(() => apiVoid(`/api/v1/news/${encodeURIComponent(id)}`, {
      method: "DELETE",
      auth: "required",
    }));
  }
}
