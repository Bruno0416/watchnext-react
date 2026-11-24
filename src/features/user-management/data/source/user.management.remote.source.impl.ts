import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { UserManagementError } from "../errors/user.management.errors";
import { AdminUserModel } from "../models/admin.user.model";
import type { UserManagementLocalSource } from "./user.management.local.source";

const base = "/api/v1/auth/admin/users";

export class UserManagementRemoteSourceImpl implements UserManagementLocalSource {
  private async request<T>(operation: () => Promise<T>, messages: Record<number, string> = {}): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. errores de reglas del backend con un mensaje para la vista
      if (error instanceof ApiHttpError && messages[error.status]) throw new Error(messages[error.status]);
      // 3. convertir los errores de comunicacion al dominio de usuarios
      if (error instanceof ApiHttpError) throw new UserManagementError(error.status);
      if (error instanceof TypeError) throw new UserManagementError(0);
      throw error;
    }
  }

  // ---------- consultas ----------
  async search(query: string): Promise<AdminUserModel[]> {
    const params = new URLSearchParams({ q: query });
    const json = await this.request(() => apiJson<JsonArray>(`${base}?${params}`, { auth: "required" }));
    return json.map((item) => AdminUserModel.fromJson(item));
  }

  async getById(userId: string): Promise<AdminUserModel> {
    const json = await this.request(() =>
      apiJson<JsonObject>(`${base}/${encodeURIComponent(userId)}`, { auth: "required" }),
    );
    return AdminUserModel.fromJson(json);
  }

  // ---------- acciones ----------
  async create(input: { email: string; password: string; role: "ADMIN" | "USER" }): Promise<AdminUserModel> {
    const json = await this.request(() => apiJson<JsonObject>(base, {
      method: "POST",
      auth: "required",
      body: JSON.stringify(input),
    }), {
      400: "Datos invalidos. Correo maximo 100 caracteres, contraseña entre 8 y 60 caracteres y rol obligatorio.",
      409: "Ya existe una cuenta con ese correo.",
    });
    return AdminUserModel.fromJson(json);
  }

  async updateIdentity(userId: string, input: { username: string; displayName: string }): Promise<AdminUserModel> {
    const json = await this.request(() => apiJson<JsonObject>(`${base}/${encodeURIComponent(userId)}/identity`, {
      method: "PUT",
      auth: "required",
      body: JSON.stringify(input),
    }), {
      400: "El usuario debe tener entre 3 y 30 caracteres: letras minusculas, numeros o guion bajo, y no puede ser un nombre reservado.",
      409: "El nombre de usuario ya esta en uso.",
    });
    return AdminUserModel.fromJson(json);
  }

  delete(userId: string): Promise<void> {
    return this.request(() => apiVoid(`${base}/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      auth: "required",
    }), {
      400: "No puedes eliminar tu propia cuenta administrativa.",
      409: "No puedes eliminar el ultimo administrador.",
    });
  }
}
