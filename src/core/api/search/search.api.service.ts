import type { JsonObject } from "../../mock/json.types";
import type { HttpClient } from "../http.client";

// ---------- search-service real (mismo metodo que el mock) ----------
export class SearchApiService {
  constructor(private readonly http: HttpClient) {}

  async search(query: string): Promise<JsonObject> {
    // 1. buscar contenido y perfiles en el agregador
    const res = await this.http.get<JsonObject>("/search", { query: { q: query } });

    if (res.ok && res.data) {
      return res.data;
    }

    // 2. si falla devuelvo el mismo formato sin resultados
    return {
      content: { originalQuery: query, executedQuery: query, corrected: false, totalResults: 0, results: [] },
      users: { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 },
      contentAvailable: false,
      usersAvailable: false,
    };
  }
}
