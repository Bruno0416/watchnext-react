import type { JsonObject } from "../json.types";

export class ListStorage {
  private readonly key = "lists-v2";
  private readonly legacyKey = "lists";

  private read(key: string): JsonObject | null {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as JsonObject)
        : null;
    } catch {
      return null;
    }
  }

  get(): JsonObject | null {
    return this.read(this.key);
  }

  getLegacy(): JsonObject | null {
    return this.read(this.legacyKey);
  }

  set(value: JsonObject): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
