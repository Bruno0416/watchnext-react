import type { JsonArray, JsonObject } from "../../mock/json.types";
import type { HttpClient } from "../http.client";

// ---------- news-service real (mismos metodos que el mock) ----------
export class NewsApiService {
  constructor(private readonly http: HttpClient) {}

  // ---------- consultas publicas ----------
  async getAll(): Promise<JsonArray> {
    const res = await this.http.get<JsonArray>("/news", { auth: false });

    return res.ok && res.data ? res.data : [];
  }

  async getById(id: string): Promise<JsonObject | null> {
    const res = await this.http.get<JsonObject>(`/news/${encodeURIComponent(id)}`, { auth: false });

    return res.ok ? res.data : null;
  }

  async getBySlug(slug: string): Promise<JsonObject | null> {
    const res = await this.http.get<JsonObject>(`/news/slug/${encodeURIComponent(slug)}`, { auth: false });

    return res.ok ? res.data : null;
  }

  // ---------- administracion (solo admin) ----------
  async create(request: JsonObject): Promise<JsonObject> {
    const res = await this.http.post<JsonObject>("/news", request);

    if (!res.ok || !res.data) {
      throw new Error(`No se pudo publicar la noticia (${res.status})`);
    }

    return res.data;
  }

  async update(id: string, request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.put<JsonObject>(`/news/${encodeURIComponent(id)}`, request);

    return res.ok ? res.data : null;
  }

  async delete(id: string): Promise<null> {
    await this.http.delete(`/news/${encodeURIComponent(id)}`);

    return null;
  }
}
