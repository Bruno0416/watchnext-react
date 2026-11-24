import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import { getStoredTokens, readAccessClaims } from "../../../../core/http/auth.session";
import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { AdminError } from "../errors/admin.errors";
import { AdminSummaryModel } from "../models/admin.summary.model";
import type { AdminLocalSource } from "./admin.local.source";

export class AdminRemoteSourceImpl implements AdminLocalSource {
  async getSummary(): Promise<AdminSummaryModel> {
    try {
      // 1. pedir usuarios y noticias a la vez
      const [users, news] = await Promise.all([
        apiJson<JsonObject>("/api/v1/users/search?q=&size=100", { auth: "required" }),
        apiJson<JsonArray>("/api/v1/news"),
      ]);

      // 2. el backend no manda el rol, solo se sabe el del admin de la sesion
      const token = getStoredTokens()?.token;
      const myId = token ? readAccessClaims(token)?.id : null;
      const content = Array.isArray(users.content) ? (users.content as JsonObject[]) : [];
      const list = content.map((user) => ({
        ...user,
        role: user.userId === myId ? "ADMIN" : "USER",
        // si ya tiene perfil en el user-service termino el onboarding
        onboardingCompleted: true,
      }));

      return new AdminSummaryModel(list, news);
    } catch (error) {
      // 3. traducir errores de comunicacion al dominio de admin
      if (error instanceof ApiHttpError) throw new AdminError(error.status);
      if (error instanceof TypeError) throw new AdminError(0);
      throw error;
    }
  }
}
