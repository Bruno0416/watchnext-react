import type { JsonArray, JsonObject } from "../../mock/json.types";
import { API_LANGUAGE } from "../api.config";
import type { HttpClient } from "../http.client";

// ---------- user-service real (mismos metodos que el mock) ----------
export class UserApiService {
  constructor(private readonly http: HttpClient) {}

  // ---------- perfil propio ----------
  async getMyProfile(): Promise<JsonObject | null> {
    // 1. sin perfil (onboarding pendiente) el backend responde 404
    const res = await this.http.get<JsonObject>("/users/me", { query: { language: API_LANGUAGE } });

    return res.ok ? res.data : null;
  }

  async updateProfile(request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.put<JsonObject>("/users/me", request, {
      query: { language: API_LANGUAGE },
    });

    return res.ok ? res.data : null;
  }

  // ---------- onboarding ----------
  async completeOnboarding(request: JsonObject): Promise<JsonObject | null> {
    // 1. el endpoint es multipart: los datos van como json en la parte "data"
    const form = new FormData();
    form.append("data", new Blob([JSON.stringify(request)], { type: "application/json" }));

    const res = await this.http.put("/users/me/onboarding", form);

    return res.ok ? { success: true } : null;
  }

  async checkUsernameAvailable(username: string): Promise<JsonObject> {
    const res = await this.http.get<JsonObject>("/users/username-available", { query: { username } });

    return res.ok && res.data ? res.data : { available: false };
  }

  // ---------- perfil publico ----------
  async getProfile(username: string): Promise<JsonObject | null> {
    const res = await this.http.get<JsonObject>(`/users/${encodeURIComponent(username)}`, {
      query: { language: API_LANGUAGE },
    });

    return res.ok ? res.data : null;
  }

  // ---------- seguidores y seguidos ----------
  async getMyFollowers(): Promise<JsonArray | null> {
    return this.page("/users/me/followers");
  }

  async getMyFollowing(): Promise<JsonArray | null> {
    return this.page("/users/me/following");
  }

  async follow(username: string): Promise<JsonObject | null> {
    const res = await this.http.post(`/users/${encodeURIComponent(username)}/follow`);

    return res.ok ? { success: true } : null;
  }

  async unfollow(username: string): Promise<JsonObject | null> {
    const res = await this.http.delete(`/users/${encodeURIComponent(username)}/follow`);

    return res.ok ? { success: true } : null;
  }

  // ---------- helpers ----------
  private async page(path: string): Promise<JsonArray | null> {
    // 1. el backend pagina; pido una pagina grande y devuelvo solo la lista
    const res = await this.http.get<JsonObject>(path, { query: { size: 100 } });

    return res.ok && res.data ? ((res.data.content as JsonArray) ?? []) : null;
  }
}
