import type { JsonArray, JsonObject } from "../json.types";
import { ListStorage } from "./list.storage";

interface ListsSeed extends JsonObject {
  myLists: JsonObject & { lists: JsonArray };
  details: Record<string, JsonObject>;
}

export class ListDb {
  private storage: ListStorage;

  constructor(storage: ListStorage) {
    this.storage = storage;
  }

  private data: ListsSeed | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<ListsSeed> {
    if (this.data) {
      return this.data;
    }

    const stored = this.storage.get() as ListsSeed | null;

    if (stored) {
      this.data = structuredClone(stored);
      return this.data;
    }

    const response = await fetch("/data/lists.json");
    this.data = (await response.json()) as ListsSeed;
    this.storage.set(this.data);

    return this.data;
  }

  private persist(): void {
    if (this.data) {
      this.storage.set(this.data);
    }
  }

  // ---------- consultas ----------
  async getAll(): Promise<JsonObject> {
    const data = await this.load();
    return structuredClone(data.myLists);
  }

  async findById(id: string): Promise<JsonObject | null> {
    const data = await this.load();
    const list = data.details[id];

    return list ? structuredClone(list) : null;
  }

  async insert(list: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const id = list.id as string;
    const detail = structuredClone(list);
    const summary = this.toSummary(detail);

    data.details[id] = detail;
    data.myLists.lists.push(summary);
    this.persist();

    return structuredClone(detail);
  }

  async update(id: string, changes: JsonObject): Promise<JsonObject | null> {
    const data = await this.load();
    const detail = data.details[id];

    if (!detail) {
      return null;
    }

    data.details[id] = {
      ...detail,
      ...structuredClone(changes),
    };

    const summaryIndex = data.myLists.lists.findIndex((item) => item.id === id);

    if (summaryIndex >= 0) {
      data.myLists.lists[summaryIndex] = this.toSummary(data.details[id]);
    }

    this.persist();
    return structuredClone(data.details[id]);
  }

  async delete(id: string): Promise<null> {
    const data = await this.load();

    delete data.details[id];
    data.myLists.lists = data.myLists.lists.filter((item) => item.id !== id);
    this.persist();

    return null;
  }

  // --- helper privado ---

  private toSummary(detail: JsonObject): JsonObject {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description,
      visibility: detail.visibility,
      itemCount: (detail.items as JsonArray).length,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    };
  }
}
