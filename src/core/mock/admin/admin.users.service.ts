import type { JsonArray, JsonObject } from "../json.types";
import type { AuthDb } from "../auth/auth.db";
import type { AuthStorage } from "../auth/auth.storage";
import type { ProfileDb } from "../user/profile.db";
import type { ListDb } from "../list/list.db";
import type { FeedbackDb } from "../feedback/feedback.db";

/**
 * Administracion mock: consulta, alta de cuentas y correccion de nombres.
 * Las operaciones de escritura requieren una sesion administrativa activa.
 * No se modifican los mecanismos de autenticacion ni su almacenamiento.
 */
export class AdminUsersService {
  constructor(
    private readonly authDb: AuthDb,
    private readonly profileDb: ProfileDb,
    private readonly authStorage?: AuthStorage,
    private readonly listDb?: ListDb,
    private readonly feedbackDb?: FeedbackDb,
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

  async create(request: JsonObject): Promise<JsonObject> {
    // 1. comprobar permisos del actor sin modificar la sesion
    this.requireAdmin();

    // 2. validar los unicos campos permitidos en el alta
    const email = typeof request.email === "string" ? request.email.trim().toLowerCase() : "";
    const password = request.password;
    const role = request.role;
    if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== "string" || password.length < 6 || password.length > 10 ||
        (role !== "ADMIN" && role !== "USER")) {
      throw new Error("Datos invalidos. Correo maximo 100 caracteres, contraseña entre 6 y 10 caracteres y rol obligatorio.");
    }
    if (await this.authDb.findByEmail(email)) {
      throw new Error("Ya existe una cuenta con ese correo.");
    }

    // 3. usar el mismo registro en memoria que el flujo normal
    const stored = await this.authDb.insert({
      id: crypto.randomUUID(), email, password, role, emailVerified: true,
    });
    return this.armar(stored, null);
  }

  async updateIdentity(userId: string, request: JsonObject): Promise<JsonObject | null> {
    // 1. comprobar permisos del actor sin validar cuentas ajenas a la sesion
    this.requireAdmin();
    const username = typeof request.username === "string" ? request.username.trim() : "";
    const displayName = typeof request.displayName === "string" ? request.displayName.trim() : "";

    // 2. aplicar reglas del onboarding para evitar identidades invalidas
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      throw new Error("El usuario debe tener entre 3 y 30 caracteres: letras minusculas, numeros o guion bajo.");
    }
    if (displayName.length > 50) {
      throw new Error("El nombre visible no puede superar 50 caracteres.");
    }

    // 3. exigir perfil existente y nombre de usuario no ocupado
    const cuenta = (await this.authDb.getAll()).find((c) => c.id === userId);
    if (!cuenta) return null;
    const profile = await this.profileDb.findByUserId(userId);
    if (!profile) throw new Error("Este usuario debe completar el onboarding antes de editar su identidad.");
    const taken = await this.profileDb.findByUsername(username);
    if (taken && taken.userId !== userId) {
      throw new Error("El nombre de usuario ya esta en uso.");
    }

    // 4. actualizar exclusivamente los campos de identidad
    const updated = await this.profileDb.update(userId, {
      username, displayName: displayName || null, updatedAt: new Date().toISOString(),
    });
    return updated ? this.armar(cuenta, updated) : null;
  }

  // ---------- baja administrativa ----------
  async delete(userId: string): Promise<void> {
    this.requireAdmin();
    if (!userId || userId === this.authStorage?.getUserId()) {
      throw new Error("No puedes eliminar tu propia cuenta administrativa.");
    }
    const accounts = await this.authDb.getAll();
    const target = accounts.find((account) => account.id === userId);
    if (!target) throw new Error("El usuario ya no existe.");
    if (target.role === "ADMIN" && accounts.filter((account) => account.role === "ADMIN").length <= 1) {
      throw new Error("No puedes eliminar el ultimo administrador.");
    }
    if (!this.listDb || !this.feedbackDb) {
      throw new Error("No se pudo preparar la eliminacion de datos asociados.");
    }

    // Eliminar registros asociados antes de retirar la cuenta del mock en memoria.
    await this.feedbackDb.deleteByUserId(userId);
    await this.listDb.deleteByUserId(userId);
    await this.profileDb.deleteByUserId(userId);
    await this.authDb.deleteById(userId);
  }

  private requireAdmin(): void {
    if (this.authStorage?.getRole() !== "ADMIN" ||
        !this.authStorage.getUserId() || !this.authStorage.getTokens()) {
      throw new Error("No tienes permisos para administrar usuarios.");
    }
  }

  // nunca devolver la contraseña, tampoco para cuentas recien creadas
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
