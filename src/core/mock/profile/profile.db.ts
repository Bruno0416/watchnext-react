import type { JsonArray, JsonObject } from "../json.types";
import { ProfileStorage } from "./profile.storage";

interface ProfileSeed extends JsonObject {
  profiles: JsonArray;
}

export class ProfileDb {
  private storage: ProfileStorage;

  constructor(storage: ProfileStorage) {
    this.storage = storage;
  }

  private data: ProfileSeed | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<ProfileSeed> {
    if (this.data) {
      return this.data;
    }

    const stored = this.storage.get() as ProfileSeed | null;

    if (stored) {
      this.data = structuredClone(stored);
      return this.data;
    }

    const response = await fetch("/data/profiles.json");
    this.data = (await response.json()) as ProfileSeed;
    this.storage.set(this.data);

    return this.data;
  }

  private persist(): void {
    if (this.data) {
      this.storage.set(this.data);
    }
  }

  // ---------- consultas ----------
  async findByUserId(userId: string): Promise<JsonObject | null> {
    const data = await this.load();
    const profile = data.profiles.find((item) => item.userId === userId);

    return profile ? structuredClone(profile) : null;
  }

  async findByUsername(username: string): Promise<JsonObject | null> {
    const data = await this.load();
    const profile = data.profiles.find((item) => item.username === username);

    return profile ? structuredClone(profile) : null;
  }

  async insert(profile: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const stored = structuredClone(profile);

    data.profiles.push(stored);
    this.persist();

    return structuredClone(stored);
  }

  async update(
    userId: string,
    changes: JsonObject,
  ): Promise<JsonObject | null> {
    const data = await this.load();
    const index = data.profiles.findIndex((item) => item.userId === userId);

    if (index < 0) {
      return null;
    }

    data.profiles[index] = {
      ...data.profiles[index],
      ...structuredClone(changes),
    };
    this.persist();

    return structuredClone(data.profiles[index]);
  }
}
