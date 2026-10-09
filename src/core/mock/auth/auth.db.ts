import type { JsonArray, JsonObject } from "../json.types";

interface AuthSeed {
  users: JsonArray;
}

export class AuthDb {
  private users: JsonArray | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<JsonArray> {
    if (this.users) {
      return this.users;
    }

    const response = await fetch("/data/auth.json");
    const seed = (await response.json()) as AuthSeed;

    this.users = structuredClone(seed.users);
    return this.users;
  }

  // ---------- consultas ----------
  async findByEmail(email: string): Promise<JsonObject | null> {
    const users = await this.load();
    const user = users.find((item) => item.email === email);

    return user ? structuredClone(user) : null;
  }

  async findByCredentials(
    email: string,
    password: string,
  ): Promise<JsonObject | null> {
    const users = await this.load();
    const user = users.find(
      (item) => item.email === email && item.password === password,
    );

    return user ? structuredClone(user) : null;
  }

  async insert(user: JsonObject): Promise<JsonObject> {
    const users = await this.load();
    const stored = structuredClone(user);

    users.push(stored);
    return structuredClone(stored);
  }
}
