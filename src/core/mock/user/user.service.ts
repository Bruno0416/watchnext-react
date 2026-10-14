import type { JsonArray, JsonObject } from "../json.types";
import type { AuthStorage } from "../auth/auth.storage";
import type { ContentService } from "../content/content.service";
import { ProfileDb } from "./profile.db";

export class UserService {
  private readonly db: ProfileDb;
  private readonly authStorage: AuthStorage;
  private readonly contentService: ContentService;

  constructor(
    db: ProfileDb,
    authStorage: AuthStorage,
    contentService: ContentService,
  ) {
    this.db = db;
    this.authStorage = authStorage;
    this.contentService = contentService;
  }

  // ---------- perfil propio ----------
  async getMyProfile(): Promise<JsonObject | null> {
    // 1. obtener usuario autenticado
    const userId = this.authStorage.getUserId();

    if (!userId) {
      return null;
    }

    // 2. buscar perfil asociado
    const profile = await this.db.findByUserId(userId);

    if (!profile) {
      return null;
    }

    // 3. devolver respuesta equivalente al microservicio
    return this.toProfileResponse(profile);
  }

  async updateProfile(request: JsonObject): Promise<JsonObject | null> {
    // 1. obtener usuario autenticado
    const userId = this.authStorage.getUserId();

    if (!userId) {
      return null;
    }

    // 2. actualizar campos recibidos
    const updated = await this.db.update(userId, {
      ...structuredClone(request),
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return null;
    }

    // 3. devolver perfil actualizado
    return this.toProfileResponse(updated);
  }

  // ---------- onboarding ----------
  async completeOnboarding(request: JsonObject): Promise<JsonObject | null> {
    // 1. obtener usuario autenticado
    const userId = this.authStorage.getUserId();

    if (!userId) {
      return null;
    }

    // 2. evitar crear un segundo perfil para el mismo usuario
    const currentProfile = await this.db.findByUserId(userId);

    if (currentProfile) {
      return null;
    }

    // 3. evitar username duplicado
    const username = request.username as string;
    const usernameTaken = await this.db.findByUsername(username);

    if (usernameTaken) {
      return null;
    }

    // 4. crear perfil con los datos del onboarding
    const now = new Date().toISOString();
    const favorites = ((request.favorites as JsonArray | undefined) ?? [])
      .slice()
      .sort(
        (a, b) =>
          ((a.position as number | undefined) ?? Number.MAX_SAFE_INTEGER) -
          ((b.position as number | undefined) ?? Number.MAX_SAFE_INTEGER),
      );

    await this.db.insert({
      id: crypto.randomUUID(),
      userId,
      username,
      displayName: request.displayName ?? null,
      bio: request.bio ?? null,
      avatarUrl: null,
      country: String(request.country ?? "").toUpperCase(),
      visibility: request.visibility ?? "PRIVATE",
      onboardingCompleted: true,
      followersCount: 0,
      followingCount: 0,
      favorites,
      followers: [],
      following: [],
      createdAt: now,
      updatedAt: now,
    });

    // 5. simular respuesta sin contenido del endpoint real
    return {
      success: true,
    };
  }

  async checkUsernameAvailable(username: string): Promise<JsonObject> {
    // 1. buscar username existente
    const profile = await this.db.findByUsername(username);

    // 2. devolver respuesta del endpoint real
    return {
      available: profile === null,
    };
  }

  // ---------- perfil publico ----------
  async getProfile(username: string): Promise<JsonObject | null> {
    const profile = await this.db.findByUsername(username);

    if (!profile) {
      return null;
    }

    return this.toProfileResponse(profile);
  }

  // ---------- seguidores y seguidos ----------
  async getMyFollowers(): Promise<JsonArray | null> {
    const profile = await this.getStoredMyProfile();
    return profile ? structuredClone(profile.followers as JsonArray) : null;
  }

  async getMyFollowing(): Promise<JsonArray | null> {
    const profile = await this.getStoredMyProfile();
    return profile ? structuredClone(profile.following as JsonArray) : null;
  }

  async follow(username: string): Promise<JsonObject | null> {
    // 1. obtener perfiles relacionados
    const profile = await this.getStoredMyProfile();
    const target = await this.db.findByUsername(username);

    if (!profile || !target) {
      return null;
    }

    // 2. actualizar ambos lados de la relacion
    const following = structuredClone(profile.following as JsonArray);
    const followers = structuredClone(target.followers as JsonArray);

    following.push(this.toSummary(target));
    followers.push(this.toSummary(profile));

    await this.db.update(profile.userId as string, {
      following,
      followingCount: following.length,
    });
    await this.db.update(target.userId as string, {
      followers,
      followersCount: followers.length,
    });

    return {
      success: true,
    };
  }

  async unfollow(username: string): Promise<JsonObject | null> {
    // 1. obtener perfiles relacionados
    const profile = await this.getStoredMyProfile();
    const target = await this.db.findByUsername(username);

    if (!profile || !target) {
      return null;
    }

    // 2. eliminar ambos lados de la relacion
    const following = (profile.following as JsonArray).filter(
      (item) => item.userId !== target.userId,
    );
    const followers = (target.followers as JsonArray).filter(
      (item) => item.userId !== profile.userId,
    );

    await this.db.update(profile.userId as string, {
      following,
      followingCount: following.length,
    });
    await this.db.update(target.userId as string, {
      followers,
      followersCount: followers.length,
    });

    return {
      success: true,
    };
  }

  // --- helper privado ---
  private async getStoredMyProfile(): Promise<JsonObject | null> {
    const userId = this.authStorage.getUserId();
    return userId ? this.db.findByUserId(userId) : null;
  }

  private async toProfileResponse(profile: JsonObject): Promise<JsonObject> {
    // 1. hidratar favoritos mediante content service
    const favorites = (profile.favorites as JsonArray | undefined) ?? [];
    const content = favorites.length
      ? await this.contentService.getBulkContent(favorites)
      : [];

    // 2. devolver solo los campos expuestos por profile response
    return {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName ?? null,
      bio: profile.bio ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      country: profile.country ?? null,
      visibility: profile.visibility,
      onboardingCompleted: profile.onboardingCompleted ?? false,
      followersCount: profile.followersCount ?? 0,
      followingCount: profile.followingCount ?? 0,
      favorites: content,
      createdAt: profile.createdAt ?? null,
      updatedAt: profile.updatedAt ?? null,
    };
  }

  private toSummary(profile: JsonObject): JsonObject {
    return {
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    };
  }
}
