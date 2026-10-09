import type { JsonArray, JsonObject } from "../json.types";
import { NewsDb } from "./news.db";

export class NewsService {
  private db: NewsDb;

  constructor(db: NewsDb) {
    this.db = db;
  }

  // ---------- endpoints (simulados) ----------
  async getAll(): Promise<JsonArray> {
    return this.db.getAll();
  }

  async getById(id: string): Promise<JsonObject | null> {
    return this.db.findById(id);
  }

  async getBySlug(slug: string): Promise<JsonObject | null> {
    return this.db.findBySlug(slug);
  }

  async create(request: JsonObject): Promise<JsonObject> {
    return this.db.insert({
      id: crypto.randomUUID(),
      ...structuredClone(request),
    });
  }

  async update(id: string, request: JsonObject): Promise<JsonObject | null> {
    return this.db.update(id, request);
  }

  async delete(id: string): Promise<null> {
    return this.db.delete(id);
  }
}
