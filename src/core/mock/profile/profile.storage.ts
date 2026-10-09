import type { JsonObject } from "../json.types";

export class ProfileStorage {
  private key = "profiles";

  get(): JsonObject | null {
    const value = localStorage.getItem(this.key);
    return value ? (JSON.parse(value) as JsonObject) : null;
  }

  set(value: JsonObject): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
