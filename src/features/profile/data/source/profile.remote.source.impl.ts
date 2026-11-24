import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/http/json.types";
import { ProfileError } from "../errors/profile.errors";
import { ProfileModel } from "../models/profile.model";
import type { ProfileRemoteSource } from "./profile.remote.source";

export class ProfileRemoteSourceImpl implements ProfileRemoteSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de perfil
      if (error instanceof ApiHttpError) throw new ProfileError(error.status);
      if (error instanceof TypeError) throw new ProfileError(0);
      throw error;
    }
  }

  async getMine(): Promise<ProfileModel> {
    const json = await this.request(() =>
      apiJson<JsonObject>("/api/v1/users/me", { auth: "required" }),
    );
    return ProfileModel.fromJson(json);
  }

  async getByUsername(username: string): Promise<ProfileModel> {
    const json = await this.request(() =>
      apiJson<JsonObject>(`/api/v1/users/${encodeURIComponent(username)}`, { auth: "required" }),
    );
    return ProfileModel.fromJson(json);
  }

  async update(request: JsonObject): Promise<ProfileModel> {
    // 1. los favoritos tienen su propio endpoint en el backend
    if (Array.isArray(request.favorites)) {
      const items = (request.favorites as JsonObject[]).map((item, index) => ({
        tmdbId: item.tmdbId,
        mediaType: String(item.mediaType ?? "").toUpperCase(),
        position: typeof item.position === "number" ? item.position : index,
      }));
      await this.request(() => apiVoid("/api/v1/users/me/favorites", {
        method: "PUT",
        auth: "required",
        body: JSON.stringify({ items }),
      }));
      return this.getMine();
    }

    // 2. el resto de datos del perfil
    const json = await this.request(() => apiJson<JsonObject>("/api/v1/users/me", {
      method: "PUT",
      auth: "required",
      body: JSON.stringify(request),
    }));
    return ProfileModel.fromJson(json);
  }
}
