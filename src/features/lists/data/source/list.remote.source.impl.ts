import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import { getStoredTokens, readAccessClaims } from "../../../../core/http/auth.session";
import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { ListError } from "../errors/list.errors";
import type { ListItemModel } from "../models/list.item.model";
import { ListSummaryModel } from "../models/list.summary.model";
import { MediaListModel } from "../models/media.list.model";
import type { ListLocalSource } from "./list.local.source";

export class ListRemoteSourceImpl implements ListLocalSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de listas
      if (error instanceof ApiHttpError) throw new ListError(error.status);
      if (error instanceof TypeError) throw new ListError(0);
      throw error;
    }
  }

  async getAll(): Promise<ListSummaryModel[]> {
    // 1. el backend no devuelve el dueño, son todas del usuario de la sesion
    const userId = this.currentUserId();
    const json = await this.request(() =>
      apiJson<JsonObject>("/api/v1/list/my-lists", { auth: "required" }),
    );
    const lists = Array.isArray(json.lists) ? (json.lists as JsonArray) : [];
    return lists.map((item) => ListSummaryModel.fromJson({ ...item, userId }));
  }

  async getById(id: string): Promise<MediaListModel> {
    // 1. pedir el detalle de la lista
    const json = await this.request(() =>
      apiJson<JsonObject>(`/api/v1/list/${encodeURIComponent(id)}`, { auth: "required" }),
    );
    // 2. marcar como propia si esta en mis listas, asi se puede editar
    const mine = await this.myListIds();
    return MediaListModel.fromJson({
      ...json,
      userId: mine.has(id) ? this.currentUserId() : "",
    });
  }

  async create(request: JsonObject): Promise<MediaListModel> {
    // 1. crear la lista (el backend no recibe visibilidad)
    await this.request(() => apiVoid("/api/v1/list/create", {
      method: "POST",
      auth: "required",
      body: JSON.stringify({
        name: request.name,
        description: request.description || null,
        contentRefs: [],
      }),
    }));
    // 2. el backend no devuelve la lista, buscar la nueva por nombre
    const lists = await this.getAll();
    const created = lists.filter((list) => list.name === request.name).at(-1);
    if (!created) throw new ListError(404);
    return this.getById(created.id);
  }

  delete(id: string): Promise<void> {
    return this.request(() => apiVoid(`/api/v1/list/delete/${encodeURIComponent(id)}`, {
      method: "DELETE",
      auth: "required",
    }));
  }

  async addItem(id: string, item: ListItemModel): Promise<MediaListModel> {
    await this.request(() => apiVoid(`/api/v1/list/add-items/${encodeURIComponent(id)}`, {
      method: "POST",
      auth: "required",
      body: JSON.stringify({ items: [{ tmdbId: item.tmdbId, mediaType: item.mediaType }] }),
    }));
    return this.getById(id);
  }

  async removeItem(id: string, tmdbId: number, mediaType: string): Promise<MediaListModel> {
    await this.request(() => apiVoid(`/api/v1/list/remove-items/${encodeURIComponent(id)}`, {
      method: "DELETE",
      auth: "required",
      body: JSON.stringify({ items: [{ tmdbId, mediaType }] }),
    }));
    return this.getById(id);
  }

  // ---------- helpers ----------
  private currentUserId(): string {
    const token = getStoredTokens()?.token;
    const id = token ? readAccessClaims(token)?.id : null;
    return typeof id === "string" ? id : "";
  }

  private async myListIds(): Promise<Set<string>> {
    const lists = await this.getAll();
    return new Set(lists.map((list) => list.id));
  }
}
