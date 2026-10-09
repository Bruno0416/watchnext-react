import type { JsonArray, JsonObject } from "../json.types";
import { ProfileDb } from "./profile.db";

export class ProfileService {
  private db: ProfileDb;

  constructor(db: ProfileDb) {
    this.db = db;
  }

  // TODO: implementar endpoint simulado para onboarding

  // ---------- endpoints (simulados) ----------
  async getByUserId(userId: string): Promise<JsonObject | null> {
    return this.db.findByUserId(userId);
  }

  async getByUsername(username: string): Promise<JsonObject | null> {
    return this.db.findByUsername(username);
  }

  async create(request: JsonObject): Promise<JsonObject> {
    return this.db.insert({
      id: crypto.randomUUID(),
      ...structuredClone(request),
    });
  }

  async update(
    userId: string,
    request: JsonObject,
  ): Promise<JsonObject | null> {
    return this.db.update(userId, request);
  }

  async getFollowers(userId: string): Promise<JsonArray | null> {
    const profile = await this.db.findByUserId(userId);
    return profile ? structuredClone(profile.followers as JsonArray) : null;
  }

  async getFollowing(userId: string): Promise<JsonArray | null> {
    const profile = await this.db.findByUserId(userId);
    return profile ? structuredClone(profile.following as JsonArray) : null;
  }

  async follow(
    userId: string,
    targetUserId: string,
  ): Promise<JsonObject | null> {
    // 1. obtener perfiles relacionados
    const profile = await this.db.findByUserId(userId);
    const target = await this.db.findByUserId(targetUserId);

    if (!profile || !target) {
      return null;
    }

    // 2. actualizar ambos lados de la relacion
    const following = structuredClone(profile.following as JsonArray);
    const followers = structuredClone(target.followers as JsonArray);

    following.push(this.toSummary(target));
    followers.push(this.toSummary(profile));

    await this.db.update(userId, {
      following,
      followingCount: following.length,
    });
    await this.db.update(targetUserId, {
      followers,
      followersCount: followers.length,
    });

    return this.db.findByUserId(userId);
  }

  async unfollow(
    userId: string,
    targetUserId: string,
  ): Promise<JsonObject | null> {
    // 1. obtener perfiles relacionados
    const profile = await this.db.findByUserId(userId);
    const target = await this.db.findByUserId(targetUserId);

    if (!profile || !target) {
      return null;
    }

    // 2. eliminar ambos lados de la relacion
    const following = (profile.following as JsonArray).filter(
      (item) => item.userId !== targetUserId,
    );
    const followers = (target.followers as JsonArray).filter(
      (item) => item.userId !== userId,
    );

    await this.db.update(userId, {
      following,
      followingCount: following.length,
    });
    await this.db.update(targetUserId, {
      followers,
      followersCount: followers.length,
    });

    return this.db.findByUserId(userId);
  }

  // ---- helper ----
  private toSummary(profile: JsonObject): JsonObject {
    return {
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    };
  }
}
