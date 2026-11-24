import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/mock/json.types";
import { ProfileError } from "../errors/profile.errors";
import { ProfileModel } from "../models/profile.model";
import type { ProfileLocalSource } from "./profile.local.source";

export class ProfileRemoteSourceImpl implements ProfileLocalSource {
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
    const json = await this.request(() => apiJson<JsonObject>("/api/v1/users/me", {
      method: "PUT",
      auth: "required",
      body: JSON.stringify(request),
    }));
    return ProfileModel.fromJson(json);
  }
}
