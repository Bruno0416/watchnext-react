import type { AuthStorage } from "../../mock/auth/auth.storage";
import type { JsonObject } from "../../mock/json.types";
import { readTokenClaims, type HttpClient } from "../http.client";

// ---------- auth-service real (mismos metodos que el mock) ----------
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: AuthStorage,
  ) {}

  async login(request: JsonObject): Promise<JsonObject | null> {
    // 1. enviar credenciales
    const res = await this.http.post<JsonObject>("/auth/login", request, { auth: false });

    if (!res.ok || !res.data) {
      return null;
    }

    // 2. guardar sesion con los datos del token
    this.saveSession(res.data);

    return res.data;
  }

  async register(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.post("/auth/register", request, { auth: false });

    return res.ok ? { success: true } : null;
  }

  async confirmEmail(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.post("/auth/confirm-email", request, { auth: false });

    return res.ok ? { success: true } : null;
  }

  async refresh(request: JsonObject): Promise<JsonObject | null> {
    // 1. pedir tokens nuevos
    const res = await this.http.post<JsonObject>("/auth/refresh", request, { auth: false });

    if (!res.ok || !res.data) {
      return null;
    }

    // 2. guardar tokens nuevos
    this.saveSession(res.data);

    return res.data;
  }

  async logout(): Promise<null> {
    // 1. el backend no guarda sesion, basta con limpiar
    this.storage.clear();

    return null;
  }

  // ---------- recovery ----------
  async requestPasswordReset(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.post("/auth/password/request", request, { auth: false });

    return res.ok ? { success: true } : null;
  }

  async verifyResetCode(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.post<JsonObject>("/auth/password/verify", request, { auth: false });

    return res.ok ? res.data : null;
  }

  async resetPassword(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.post("/auth/password/reset", request, { auth: false });

    return res.ok ? { success: true } : null;
  }

  // ---------- helpers ----------
  private saveSession(tokens: JsonObject): void {
    // 1. guardar tokens
    this.storage.setTokens(tokens);

    // 2. sacar rol e id del token
    const claims = readTokenClaims(tokens.token as string);

    if (claims?.role) {
      this.storage.setRole(claims.role as string);
    }

    if (claims?.id) {
      this.storage.setUserId(claims.id as string);
    }
  }
}
