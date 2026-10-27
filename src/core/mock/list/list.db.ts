import type { JsonArray, JsonObject } from "../json.types";
import { ListStorage } from "./list.storage";

type ListsData = JsonObject & { version: 2; lists: JsonArray };

// --- ids de fixtures anteriores cuyo propietario esta verificado ---
const LEGACY_USER_BY_LIST_ID: Record<string, string> = {
  "938d0e72-510a-5b93-a21c-5dab47546b70": "2e29b7a1-07c3-5e46-8d0f-745b4f280aa7",
  "ce3d001a-4759-5e14-94a5-c178e9f1d24a": "2e29b7a1-07c3-5e46-8d0f-745b4f280aa7",
};

export class ListDb {
  private data: ListsData | null = null;

  constructor(private readonly storage: ListStorage) {}

  // ---------- carga inicial y migracion ----------
  private async load(): Promise<ListsData> {
    if (this.data) return this.data;

    const stored = this.storage.get();
    if (stored) {
      if (stored.version !== 2 || !Array.isArray(stored.lists)) {
        throw new Error("Formato de listas-v2 invalido");
      }

      this.data = structuredClone(stored) as ListsData;
      return this.data;
    }

    const legacy = this.storage.getLegacy();
    if (legacy) {
      this.data = this.migrateLegacy(legacy);
      this.persist();
      return this.data;
    }

    const response = await fetch("/data/lists.json");
    const seed = (await response.json()) as JsonObject;
    if (seed.version !== 2 || !Array.isArray(seed.lists)) {
      throw new Error("Formato del fixture de listas invalido");
    }

    this.data = structuredClone(seed) as ListsData;
    this.persist();
    return this.data;
  }

  private migrateLegacy(legacy: JsonObject): ListsData {
    const details = legacy.details;
    const lists: JsonArray = [];

    if (details && typeof details === "object" && !Array.isArray(details)) {
      for (const [id, raw] of Object.entries(details)) {
        const userId = LEGACY_USER_BY_LIST_ID[id];
        if (!userId || !raw || typeof raw !== "object" || Array.isArray(raw)) continue;

        const detail = raw as JsonObject;
        lists.push({
          ...structuredClone(detail),
          id,
          userId,
          items: Array.isArray(detail.items) ? structuredClone(detail.items) : [],
        });
      }
    }

    // El formato antiguo se conserva intacto para revisar listas sin propietario.
    return { version: 2, lists };
  }

  private persist(): void {
    if (this.data) this.storage.set(this.data);
  }

  // ---------- consultas ----------
  async getAllByUserId(userId: string): Promise<JsonObject> {
    const data = await this.load();
    const lists = data.lists
      .filter((list) => list.userId === userId)
      .map((list) => this.toSummary(list));

    return { lists: structuredClone(lists) };
  }

  async findById(id: string): Promise<JsonObject | null> {
    const data = await this.load();
    const list = data.lists.find((item) => item.id === id && typeof item.userId === "string");
    return list ? structuredClone(list) : null;
  }

  // ---------- modificaciones ----------
  async insert(list: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const detail = structuredClone(list);

    if (typeof detail.userId !== "string" || !detail.userId) {
      throw new Error("Una lista requiere userId");
    }
    if (data.lists.some((item) => item.id === detail.id)) {
      throw new Error("La lista ya existe");
    }

    data.lists.push(detail);
    this.persist();
    return structuredClone(detail);
  }

  async update(id: string, changes: JsonObject): Promise<JsonObject | null> {
    const data = await this.load();
    const index = data.lists.findIndex((item) => item.id === id);
    if (index < 0) return null;

    const current = data.lists[index];
    // No permitir cambiar id, userId ni fecha de creacion desde una modificacion.
    const allowed: JsonObject = {};
    for (const key of ["name", "description", "visibility", "items", "updatedAt"]) {
      if (Object.hasOwn(changes, key)) allowed[key] = structuredClone(changes[key]);
    }

    data.lists[index] = { ...current, ...allowed };
    this.persist();
    return structuredClone(data.lists[index]);
  }

  async delete(id: string): Promise<void> {
    const data = await this.load();
    data.lists = data.lists.filter((item) => item.id !== id);
    this.persist();
  }

  private toSummary(detail: JsonObject): JsonObject {
    return {
      id: detail.id,
      userId: detail.userId,
      name: detail.name,
      description: detail.description,
      visibility: detail.visibility,
      itemCount: Array.isArray(detail.items) ? (detail.items as JsonArray).length : 0,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    };
  }

  // ---------- baja de listas del usuario ----------
  async deleteByUserId(userId: string): Promise<void> {
    const data = await this.load();
    const next: ListsData = {
      ...data,
      lists: data.lists.filter((list) => list.userId !== userId),
    };
    this.storage.set(next);
    this.data = next;
  }

}
