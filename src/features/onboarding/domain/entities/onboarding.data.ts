import type { ProfileVisibility } from "../../../../core/models/profile.visibility";
import type { ContentRef } from "./content.ref";

export type OnboardingDataProps = {
  username: string;
  visibility: ProfileVisibility;
  displayName: string | null;
  bio: string | null;
  country: string;
  favorites: ContentRef[];
};

export class OnboardingData {
  constructor(public readonly props: OnboardingDataProps) {}

  get username(): string {
    return this.props.username;
  }

  get visibility(): ProfileVisibility {
    return this.props.visibility;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  get country(): string {
    return this.props.country;
  }

  get favorites(): ContentRef[] {
    return this.props.favorites;
  }
}
