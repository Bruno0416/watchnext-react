import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonArray } from "../../../../core/mock/json.types";
import { AdminError } from "../errors/admin.errors";
import { AdminSummaryModel } from "../models/admin.summary.model";
import type { AdminLocalSource } from "./admin.local.source";

export class AdminRemoteSourceImpl implements AdminLocalSource {
  async getSummary(): Promise<AdminSummaryModel> {
    try {
      // 1. pedir las cuentas (con rol y perfil) y las noticias a la vez
      const [users, news] = await Promise.all([
        apiJson<JsonArray>("/api/v1/auth/admin/users", { auth: "required" }),
        apiJson<JsonArray>("/api/v1/news"),
      ]);
      return new AdminSummaryModel(users, news);
    } catch (error) {
      // 2. traducir errores de comunicacion al dominio de admin
      if (error instanceof ApiHttpError) throw new AdminError(error.status);
      if (error instanceof TypeError) throw new AdminError(0);
      throw error;
    }
  }
}
