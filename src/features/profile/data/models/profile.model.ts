import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { ProfileVisibility } from "../../../../core/models/profile.visibility";
import { Profile } from "../../domain/entities/profile";
import { ProfileFavoriteModel } from "./profile.favorite.model";

function toDate(value: unknown): Date {
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function toText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

// paso el json del User Service a la entidad
export class ProfileModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly displayName: string | null,
    public readonly bio: string | null,
    public readonly avatarUrl: string | null,
    public readonly country: string | null,
    public readonly visibility: string,
    public readonly onboardingCompleted: boolean,
    public readonly followersCount: number,
    public readonly followingCount: number,
    public readonly favorites: ProfileFavoriteModel[],
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static fromJson(json: JsonObject): ProfileModel {
    const favs = Array.isArray(json.favorites) ? (json.favorites as JsonArray) : [];
    return new ProfileModel(
      String(json.id),
      String(json.userId ?? ""),
      String(json.username ?? ""),
      toText(json.displayName),
      toText(json.bio),
      toText(json.avatarUrl),
      toText(json.country),
      String(json.visibility ?? "PRIVATE"),
      Boolean(json.onboardingCompleted),
      typeof json.followersCount === "number" ? json.followersCount : 0,
      typeof json.followingCount === "number" ? json.followingCount : 0,
      favs.map((f) => ProfileFavoriteModel.fromJson(f)),
      String(json.createdAt ?? ""),
      String(json.updatedAt ?? ""),
    );
  }

  toDomain(): Profile {
    return new Profile({
      id: this.id,
      userId: this.userId,
      username: this.username,
      displayName: this.displayName,
      bio: this.bio,
      avatarUrl: this.avatarUrl,
      country: this.country,
      visibility:
        this.visibility.toUpperCase() === "PUBLIC"
          ? ProfileVisibility.PUBLIC
          : ProfileVisibility.PRIVATE,
      onboardingCompleted: this.onboardingCompleted,
      followersCount: this.followersCount,
      followingCount: this.followingCount,
      favorites: this.favorites.map((f) => f.toDomain()),
      createdAt: toDate(this.createdAt),
      updatedAt: toDate(this.updatedAt),
    });
  }
}
