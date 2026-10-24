import type { JsonObject } from "../../../../core/mock/json.types";
import type { OnboardingData } from "../../domain/entities/onboarding.data";

export class OnboardingRequestModel {
  constructor(
    public readonly username: string,
    public readonly visibility: string,
    public readonly displayName: string | null,
    public readonly bio: string | null,
    public readonly country: string,
    public readonly favorites: JsonObject[],
  ) {}

  static fromDomain(data: OnboardingData): OnboardingRequestModel {
    return new OnboardingRequestModel(
      data.username,
      data.visibility,
      data.displayName,
      data.bio,
      data.country,
      data.favorites.map((favorite) => ({
        tmdbId: favorite.tmdbId,
        mediaType: favorite.mediaType.toUpperCase(),
        position: favorite.position,
      })),
    );
  }

  toJson(): JsonObject {
    return {
      username: this.username,
      visibility: this.visibility,
      displayName: this.displayName,
      bio: this.bio,
      country: this.country,
      favorites: this.favorites,
    };
  }
}
