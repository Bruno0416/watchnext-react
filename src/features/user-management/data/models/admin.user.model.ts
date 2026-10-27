import type { JsonObject } from "../../../../core/mock/json.types";
import { AdminUser, AdminUserRole } from "../../domain/entities/admin.user";

// json del AdminUsersService -> entidad
export class AdminUserModel {
  constructor(public readonly json: JsonObject) {}

  static fromJson(json: JsonObject): AdminUserModel {
    return new AdminUserModel(json);
  }

  toDomain(): AdminUser {
    const j = this.json;
    const texto = (v: unknown) => (typeof v === "string" && v ? v : null);
    const numero = (v: unknown) => (typeof v === "number" ? v : 0);
    const fecha = texto(j.createdAt) ? new Date(j.createdAt as string) : null;

    return new AdminUser({
      userId: String(j.userId),
      email: String(j.email ?? ""),
      role: j.role === "ADMIN" ? AdminUserRole.ADMIN : AdminUserRole.USER,
      emailVerified: j.emailVerified !== false,
      username: texto(j.username),
      displayName: texto(j.displayName),
      country: texto(j.country),
      isPrivate: j.visibility === "PRIVATE",
      onboardingCompleted: j.onboardingCompleted === true,
      followersCount: numero(j.followersCount),
      followingCount: numero(j.followingCount),
      favoritesCount: numero(j.favoritesCount),
      createdAt: fecha && !Number.isNaN(fecha.getTime()) ? fecha : null,
    });
  }
}
