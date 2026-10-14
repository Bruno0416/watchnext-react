import type { JsonObject } from "../json.types";
import { AuthDb } from "./auth.db";
import { AuthStorage } from "./auth.storage";

export class AuthService {
  private readonly db: AuthDb;
  private readonly storage: AuthStorage;
  private readonly resetTokens = new Map<string, string>();

  constructor(db: AuthDb, storage: AuthStorage) {
    this.db = db;
    this.storage = storage;
  }

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
    this.storage.setUserId(user.id as string);

    return structuredClone(tokens);
  }

  async register(request: JsonObject): Promise<JsonObject | null> {
    // 1. buscar usuario existente
    const email = request.email as string;
    const existingUser = await this.db.findByEmail(email);

    if (existingUser) {
      return null;
    }

    // 2. crear usuario mock
    await this.db.insert({
      id: crypto.randomUUID(),
      email,
      password: request.password,
      role: "USER",
      emailVerified: false,
    });

    // 3. retornar respuesta simulada
    return {
      success: true,
    };
  }

  // ---------- verificacion de correo ----------
  async confirmEmail(request: JsonObject): Promise<JsonObject | null> {
    // 1. marcar usuario como verificado
    const updated = await this.db.verifyEmail(request.email as string);

    if (!updated) {
      return null;
    }

    // 2. retornar respuesta simulada
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

  // ---------- helpers ----------
  private createTokens(): JsonObject {
    return {
      token: `access-${crypto.randomUUID()}`,
      refreshToken: `refresh-${crypto.randomUUID()}`,
    };
  }

  // ---------- recovery ----------
  async requestPasswordReset(request: JsonObject): Promise<JsonObject> {
    // 1. simular envio de codigo
    console.log("[INFO] recovery solicitado: %s", request.email as string);

    return { success: true };
  }

  async verifyResetCode(request: JsonObject): Promise<JsonObject> {
    // 1. generar token temporal sin validar el codigo
    const resetToken = `reset-${crypto.randomUUID()}`;

    // 2. asociar token al correo
    this.resetTokens.set(resetToken, request.email as string);

    return { resetToken };
  }

  async resetPassword(request: JsonObject): Promise<JsonObject | null> {
    // 1. resolver correo desde token temporal
    const resetToken = request.resetToken as string;
    const email = this.resetTokens.get(resetToken);

    if (!email) {
      return null;
    }

    // 2. actualizar contrasena
    const updated = await this.db.updatePassword(
      email,
      request.newPassword as string,
    );

    if (!updated) {
      return null;
    }

    // 3. invalidar token usado
    this.resetTokens.delete(resetToken);

    return { success: true };
  }
}
