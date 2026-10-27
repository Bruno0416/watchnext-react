import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { AdminSummary } from "../../domain/entities/admin.summary";

// junto lo que devuelven los dos servicios y saco los numeros
export class AdminSummaryModel {
  constructor(
    public readonly users: JsonArray,
    public readonly news: JsonArray,
  ) {}

  toDomain(): AdminSummary {
    const users = this.users as JsonObject[];
    const news = this.news as JsonObject[];

    // la fecha mas nueva de las noticias
    const fechas = news
      .map((n) => new Date(String(n.publishedAt ?? "")))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    return new AdminSummary({
      totalUsers: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      pendingOnboarding: users.filter((u) => u.role !== "ADMIN" && u.onboardingCompleted !== true).length,
      totalNews: news.length,
      lastNewsAt: fechas[0] ?? null,
    });
  }
}
