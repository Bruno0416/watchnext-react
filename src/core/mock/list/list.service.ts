import type { JsonArray, JsonObject } from "../json.types";
import { ListDb } from "./list.db";

export class ListService {
  private db: ListDb;

  constructor(db: ListDb) {
    this.db = db;
  }

  // ---------- endpoints (simulados) ----------
  async getAll(): Promise<JsonObject> {
    return this.db.getAll();
  }

  async getById(id: string): Promise<JsonObject | null> {
    return this.db.findById(id);
  }

  async create(request: JsonObject): Promise<JsonObject> {
    const now = new Date().toISOString();

    return this.db.insert({
      id: crypto.randomUUID(),
      ...structuredClone(request),
      items: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, request: JsonObject): Promise<JsonObject | null> {
    return this.db.update(id, {
      ...structuredClone(request),
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<null> {
    return this.db.delete(id);
  }

  async addItem(id: string, item: JsonObject): Promise<JsonObject | null> {
    const list = await this.db.findById(id);

    if (!list) {
      return null;
    }

    const items = structuredClone(list.items as JsonArray);
    items.push(structuredClone(item));

    return this.db.update(id, {
      items,
      updatedAt: new Date().toISOString(),
    });
  }

  async removeItem(
    id: string,
    tmdbId: number,
    mediaType: string,
  ): Promise<JsonObject | null> {
    const list = await this.db.findById(id);

    if (!list) {
      return null;
    }

    const items = (list.items as JsonArray).filter(
      (item) => item.tmdbId !== tmdbId || item.mediaType !== mediaType,
    );

    return this.db.update(id, {
      items,
      updatedAt: new Date().toISOString(),
    });
  }
}
