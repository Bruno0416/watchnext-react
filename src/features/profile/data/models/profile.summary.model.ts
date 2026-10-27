import type { JsonObject } from "../../../../core/mock/json.types";
import { ProfileSummary } from "../../domain/entities/profile.summary";

export class ProfileSummaryModel {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly displayName: string | null,
    public readonly avatarUrl: string | null,
    public readonly visibility: string,
  ) {}

  static fromJson(json: JsonObject): ProfileSummaryModel {
    return new ProfileSummaryModel(
      String(json.userId ?? ""),
      String(json.username ?? ""),
      typeof json.displayName === "string" && json.displayName ? json.displayName : null,
      typeof json.avatarUrl === "string" && json.avatarUrl ? json.avatarUrl : null,
      String(json.visibility ?? "PUBLIC"),
    );
  }

  toDomain(): ProfileSummary {
    return new ProfileSummary({
      userId: this.userId,
      username: this.username,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      isPrivate: this.visibility.toUpperCase() === "PRIVATE",
    });
  }
}
