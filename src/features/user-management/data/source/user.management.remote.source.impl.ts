import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import { getStoredTokens, readAccessClaims } from "../../../../core/http/auth.session";
import type { JsonObject } from "../../../../core/mock/json.types";
import { UserManagementError } from "../errors/user.management.errors";
import { AdminUserModel } from "../models/admin.user.model";
import type { UserManagementLocalSource } from "./user.management.local.source";

export class UserManagementRemoteSourceImpl implements UserManagementLocalSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de usuarios
      if (error instanceof ApiHttpError) throw new UserManagementError(error.status);
      if (error instanceof TypeError) throw new UserManagementError(0);
      throw error;
    }
  }

  // ---------- consultas ----------
  async search(query: string): Promise<AdminUserModel[]> {
    // 1. buscar perfiles por username o nombre, vacio trae todos
    const users = await this.searchProfiles(query);
    return users.map((user) => AdminUserModel.fromJson(this.withRole(user)));
  }

  async getById(userId: string): Promise<AdminUserModel> {
    // 1. ubicar el perfil por su id
    const users = await this.searchProfiles("");
    const user = users.find((item) => item.userId === userId);
    if (!user) throw new UserManagementError(404);

    // 2. completar con el perfil publico
    const profile = await this.request(() =>
      apiJson<JsonObject>(`/api/v1/users/${encodeURIComponent(String(user.username))}`, { auth: "required" }),
    );
    return AdminUserModel.fromJson(this.withRole({
      ...user,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      visibility: profile.privateProfile === true || profile.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      country: profile.country ?? null,
    }));
  }

  // ---------- acciones ----------
  // el backend todavia no tiene endpoints de admin para crear, editar ni borrar usuarios
  async create(): Promise<AdminUserModel> {
    throw new UserManagementError(501);
  }

  async updateIdentity(): Promise<AdminUserModel> {
    throw new UserManagementError(501);
  }

  async delete(): Promise<void> {
    throw new UserManagementError(501);
  }

  // ---------- helpers ----------
  private async searchProfiles(query: string): Promise<JsonObject[]> {
    const params = new URLSearchParams({ q: query, size: "100" });
    const json = await this.request(() =>
      apiJson<JsonObject>(`/api/v1/users/search?${params}`, { auth: "required" }),
    );
    return Array.isArray(json.content) ? (json.content as JsonObject[]) : [];
  }

  private withRole(user: JsonObject): JsonObject {
    // el backend no manda rol ni email, solo se conoce el admin de la sesion
    const token = getStoredTokens()?.token;
    const myId = token ? readAccessClaims(token)?.id : null;
    return { ...user, role: user.userId === myId ? "ADMIN" : "USER", onboardingCompleted: true };
  }
}
