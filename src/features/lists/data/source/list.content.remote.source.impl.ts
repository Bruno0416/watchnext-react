import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/http/json.types";
import { ListError } from "../errors/list.errors";
import { ListItemModel } from "../models/list.item.model";
import type { ListContentSource } from "./list.content.source";

export class ListContentRemoteSourceImpl implements ListContentSource {
  async search(query: string): Promise<ListItemModel[]> {
    try {
      // 1. buscar en el search-service
      const params = new URLSearchParams({ q: query });
      const json = await apiJson<JsonObject>(`/api/v1/search?${params}`, { auth: "optional" });
      // 2. solo interesan las peliculas y series de content.results, no las personas
      const content = (json.content ?? {}) as JsonObject;
      const results = Array.isArray(content.results) ? (content.results as JsonObject[]) : [];
      return results
        .filter((item) => ["MOVIE", "TV"].includes(String(item.mediaType ?? "").toUpperCase()))
        .map((item) => ListItemModel.fromSearchJson(item));
    } catch (error) {
      // 3. traducir errores de comunicacion al dominio de listas
      if (error instanceof ApiHttpError) throw new ListError(error.status);
      if (error instanceof TypeError) throw new ListError(0);
      throw error;
    }
  }
}
