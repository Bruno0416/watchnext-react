import type { AuthStorage } from "../../mock/auth/auth.storage";
import type { JsonArray, JsonObject } from "../../mock/json.types";
import { ListServiceError } from "../../mock/list/list.service.error";
import { API_LANGUAGE } from "../api.config";
import type { HttpClient, HttpResponse } from "../http.client";

// ---------- list-service real (mismos metodos que el mock) ----------
export class ListApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: AuthStorage,
  ) {}

  async getAll(): Promise<JsonObject> {
    const res = this.check(await this.http.get<JsonObject>("/list/my-lists"));

    return res.data ?? { lists: [] };
  }

  async getById(id: string): Promise<JsonObject> {
    // 1. pedir detalle
    const res = this.check(
      await this.http.get<JsonObject>(`/list/${id}`, { query: { language: API_LANGUAGE } }),
    );

    // 2. el detalle no trae dueño; si esta en mis listas es mia
    const mine = await this.myListIds();

    return {
      ...(res.data as JsonObject),
      userId: mine.has(id) ? this.storage.getUserId() : "otro",
    };
  }

  async create(request: JsonObject): Promise<JsonObject> {
    // 1. crear lista (el backend no recibe visibilidad)
    this.check(
      await this.http.post("/list/create", {
        name: request.name,
        description: request.description || null,
        contentRefs: [],
      }),
    );

    // 2. el backend no devuelve la lista, busco la nueva por nombre
    const lists = ((await this.getAll()).lists as JsonArray) ?? [];
    const created = lists.filter((item) => item.name === request.name).at(-1);

    if (!created) {
      throw new ListServiceError(404);
    }

    return this.getById(created.id as string);
  }

  // el backend todavia no tiene endpoint para editar listas
  async update(_id: string, _request: JsonObject): Promise<JsonObject> {
    throw new ListServiceError(405);
  }

  async delete(id: string): Promise<null> {
    this.check(await this.http.delete(`/list/delete/${id}`));

    return null;
  }

  async addItem(id: string, item: JsonObject): Promise<JsonObject> {
    this.check(
      await this.http.post(`/list/add-items/${id}`, {
        items: [{ tmdbId: item.tmdbId, mediaType: item.mediaType }],
      }),
    );

    return this.getById(id);
  }

  async removeItem(id: string, tmdbId: number, mediaType: string): Promise<JsonObject> {
    this.check(
      await this.http.delete(`/list/remove-items/${id}`, {
        body: { items: [{ tmdbId, mediaType }] },
      }),
    );

    return this.getById(id);
  }

  // ---------- helpers ----------
  private check<T>(res: HttpResponse<T>): HttpResponse<T> {
    // 1. pasar el status http al mismo error que usa el mock
    if (!res.ok) {
      throw new ListServiceError(res.status);
    }

    return res;
  }

  private async myListIds(): Promise<Set<string>> {
    const lists = ((await this.getAll()).lists as JsonArray) ?? [];

    return new Set(lists.map((item) => item.id as string));
  }
}
