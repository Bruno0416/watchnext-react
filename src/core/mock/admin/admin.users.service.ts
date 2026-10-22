import type { JsonArray, JsonObject } from "../json.types";
import type { AuthDb } from "../auth/auth.db";
import type { ProfileDb } from "../user/profile.db";

/**
 * Consulta administrativa de usuarios, SIMULADA. El backend no tiene un endpoint de administracion,
 * asi que junto lo que ya existe: la cuenta (auth) y el perfil (user). Solo lectura: la HU pide no
 * inventar bloqueo, borrado ni cambio de rol.
 *
 *   GET /admin/users?q=texto   -> [AdminUser]
 *   GET /admin/users/{userId}  -> AdminUser
 */
export class AdminUsersService {
  constructor(
    private readonly authDb: AuthDb,
    private readonly profileDb: ProfileDb,
  ) {}

  async list(query: string): Promise<JsonArray> {
    const cuentas = await this.authDb.getAll();
    const perfiles = await this.profileDb.getAll();
    const q = query.trim().toLowerCase();

    return cuentas
      .map((c) => this.armar(c, perfiles.find((p) => p.userId === c.id) ?? null))
      .filter((u) => {
        if (!q) return true;
        return [u.email, u.username, u.displayName]
          .filter((x): x is string => typeof x === "string")
          .some((x) => x.toLowerCase().includes(q));
      });
  }

  async get(userId: string): Promise<JsonObject | null> {
    const cuentas = await this.authDb.getAll();
    const cuenta = cuentas.find((c) => c.id === userId);
    if (!cuenta) return null;
    const perfil = (await this.profileDb.findByUserId(userId)) ?? null;
    return this.armar(cuenta, perfil);
  }

  // nunca devuelvo la contraseña
  private armar(cuenta: JsonObject, perfil: JsonObject | null): JsonObject {
    return {
      userId: cuenta.id,
      email: cuenta.email,
      role: cuenta.role ?? "USER",
      emailVerified: cuenta.emailVerified ?? true,
      username: perfil?.username ?? null,
      displayName: perfil?.displayName ?? null,
      country: perfil?.country ?? null,
      visibility: perfil?.visibility ?? null,
      onboardingCompleted: perfil?.onboardingCompleted ?? false,
      followersCount: perfil?.followersCount ?? 0,
      followingCount: perfil?.followingCount ?? 0,
      favoritesCount: Array.isArray(perfil?.favorites) ? (perfil!.favorites as JsonArray).length : 0,
      createdAt: perfil?.createdAt ?? null,
    };
  }
}
