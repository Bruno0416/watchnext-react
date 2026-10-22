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
  // agregado para la vista de administracion de usuarios
  async getAll(): Promise<JsonArray> {
    const users = await this.load();
    return structuredClone(users);
  }

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

  // ---------- modificaciones ----------
  async verifyEmail(email: string): Promise<boolean> {
    // 1. buscar usuario almacenado
    const users = await this.load();
    const user = users.find((item) => item.email === email);

    if (!user) {
      return false;
    }

    // 2. marcar correo como verificado
    user.emailVerified = true;

    return true;
  }

  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    // 1. buscar usuario almacenado
    const users = await this.load();
    const user = users.find((item) => item.email === email);

    if (!user) {
      return false;
    }

    // 2. actualizar contraseña
    user.password = newPassword;

    return true;
  }

  // ---------- inserciones ----------
  async insert(user: JsonObject): Promise<JsonObject> {
    const users = await this.load();
    const stored = structuredClone(user);

    users.push(stored);
    return structuredClone(stored);
  }
}
