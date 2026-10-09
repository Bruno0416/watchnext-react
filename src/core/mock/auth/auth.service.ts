import type { JsonObject } from "../json.types";
import { AuthDb } from "./auth.db";
import { AuthStorage } from "./auth.storage";

export class AuthService {
  private readonly db: AuthDb;
  private readonly storage: AuthStorage;

  constructor(db: AuthDb, storage: AuthStorage) {
    this.db = db;
    this.storage = storage;
  }

  // TODO: implementar endpoint simulado para:
  // - recovery (3 pasos)
  // - email verification
  async login(request: JsonObject): Promise<JsonObject | null> {
    // 1. buscar credenciales recibidas
    const user = await this.db.findByCredentials(
      request.email as string,
      request.password as string,
    );

    if (!user) {
      return null;
    }

    // 2. generar tokens mock
    const tokens = this.createTokens();

    // 3. guardar datos de sesion
    this.storage.setTokens(tokens);
    this.storage.setRole(user.role as string);

    return structuredClone(tokens);
  }

  async register(request: JsonObject): Promise<JsonObject | null> {
    // 1. buscar usuario existente
    const existingUser = await this.db.findByEmail(request.email as string);

    if (existingUser) {
      return null;
    }

    // 2. crear usuario mock
    await this.db.insert({
      id: crypto.randomUUID(),
      email: request.email,
      password: request.password,
      role: "USER",
    });

    // 3. retornar respuesta simulada
    return {
      success: true,
    };
  }

  async refresh(request: JsonObject): Promise<JsonObject | null> {
    // 1. buscar tokens almacenados
    const storedTokens = this.storage.getTokens();

    if (!storedTokens || storedTokens.refreshToken !== request.refreshToken) {
      return null;
    }

    // 2. renovar tokens mock
    const tokens = this.createTokens();

    this.storage.setTokens(tokens);

    return structuredClone(tokens);
  }

  async logout(): Promise<null> {
    // 1. limpiar sesion
    this.storage.clear();

    return null;
  }

  // ---- helper ----
  private createTokens(): JsonObject {
    return {
      token: `access-${crypto.randomUUID()}`,
      refreshToken: `refresh-${crypto.randomUUID()}`,
    };
  }
}
