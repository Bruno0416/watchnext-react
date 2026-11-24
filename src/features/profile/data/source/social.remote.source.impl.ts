import { apiFetch, apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { ProfileError } from "../errors/profile.errors";
import { ProfileSummaryModel } from "../models/profile.summary.model";
import type { SocialSource } from "./social.source";

export class SocialRemoteSourceImpl implements SocialSource {
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

  // ---------- consultas ----------
  async getFollowers(username: string): Promise<ProfileSummaryModel[]> {
    // 1. el backend solo entrega los seguidores propios
    return (await this.isMe(username)) ? this.page("/api/v1/users/me/followers") : [];
  }

  async getFollowing(username: string): Promise<ProfileSummaryModel[]> {
    return (await this.isMe(username)) ? this.page("/api/v1/users/me/following") : [];
  }

  async getRelationship(username: string): Promise<JsonObject> {
    // 1. armar la relacion con mis seguidos y mis seguidores
    const [following, followers] = await Promise.all([
      this.page("/api/v1/users/me/following"),
      this.page("/api/v1/users/me/followers"),
    ]);
    return {
      following: following.some((item) => item.username === username),
      requested: false,
      followsYou: followers.some((item) => item.username === username),
    };
  }

  getMyFollowRequests(): Promise<ProfileSummaryModel[]> {
    return this.page("/api/v1/users/me/follow-requests");
  }

  // ---------- acciones ----------
  async follow(username: string): Promise<string> {
    // 1. seguir
    await this.request(() => apiFetch(`/api/v1/users/${encodeURIComponent(username)}/follow`, {
      method: "POST",
      auth: "required",
    }));
    // 2. si el perfil es privado queda como solicitud
    const relation = await this.getRelationship(username);
    return relation.following ? "FOLLOWING" : "REQUESTED";
  }

  async unfollow(username: string): Promise<void> {
    await this.request(() => apiFetch(`/api/v1/users/${encodeURIComponent(username)}/follow`, {
      method: "DELETE",
      auth: "required",
    }));
  }

  async acceptFollowRequest(username: string): Promise<void> {
    await this.request(() => apiFetch(`/api/v1/users/me/follow-requests/${encodeURIComponent(username)}`, {
      method: "POST",
      auth: "required",
    }));
  }

  async rejectFollowRequest(username: string): Promise<void> {
    await this.request(() => apiFetch(`/api/v1/users/me/follow-requests/${encodeURIComponent(username)}`, {
      method: "DELETE",
      auth: "required",
    }));
  }

  // ---------- helpers ----------
  private async page(path: string): Promise<ProfileSummaryModel[]> {
    // 1. el backend pagina; pedir una pagina grande y quedarse con la lista
    const json = await this.request(() => apiJson<JsonObject>(`${path}?size=100`, { auth: "required" }));
    const content = Array.isArray(json.content) ? (json.content as JsonArray) : [];
    return content.map((item) => ProfileSummaryModel.fromJson(item));
  }

  private async isMe(username: string): Promise<boolean> {
    const me = await this.request(() =>
      apiJson<JsonObject>("/api/v1/users/me", { auth: "required" }),
    );
    return me.username === username;
  }
}
