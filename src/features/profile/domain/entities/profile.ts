import type { ProfileVisibility } from "../../../../core/models/profile.visibility";
import type { ProfileFavorite } from "./profile.favorite";

export type ProfileProps = {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  country: string | null; // ISO 3166-1 alpha-2, tipo CL
  visibility: ProfileVisibility;
  onboardingCompleted: boolean;
  followersCount: number;
  followingCount: number;
  favorites: ProfileFavorite[];
  createdAt: Date;
  updatedAt: Date;
};

// el perfil como lo usa la app
export class Profile {
  constructor(public readonly props: ProfileProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  // lo que muestro grande: el display name y si no hay, el username
  get shownName(): string {
    return this.props.displayName?.trim() || this.props.username;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  get country(): string | null {
    return this.props.country;
  }

  get visibility(): ProfileVisibility {
    return this.props.visibility;
  }

  get isPrivate(): boolean {
    return this.props.visibility === "PRIVATE";
  }

  get onboardingCompleted(): boolean {
    return this.props.onboardingCompleted;
  }

  get followersCount(): number {
    return this.props.followersCount;
  }

  get followingCount(): number {
    return this.props.followingCount;
  }

  get favorites(): ProfileFavorite[] {
    return this.props.favorites;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // iniciales para el avatar cuando no hay foto
  get initials(): string {
    const parts = this.shownName.split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    return letters.join("") || "?";
  }
}
