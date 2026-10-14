import type { JsonObject } from "../json.types";

export class CatalogDb {
  private data: JsonObject | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<JsonObject> {
    if (this.data) {
      return this.data;
    }

    // 1. cargar catalogo desde el json local
    const response = await fetch("/data/catalog.json");
    this.data = (await response.json()) as JsonObject;

    return this.data;
  }

  // ---------- consultas ----------
  async getAll(): Promise<JsonObject> {
    return this.load();
  }
}
