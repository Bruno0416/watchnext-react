import type { Profile } from "../entities/profile";
import type {
  ProfileRepository,
  UpdateProfileData,
} from "../repositories/profile.repository";

export class UpdateProfile {
  constructor(private readonly repo: ProfileRepository) {}

  async call(data: UpdateProfileData): Promise<Profile> {
    // limpio espacios y paso el pais a mayuscula, el contrato pide ISO alpha-2
    return this.repo.update({
      ...data,
      displayName: data.displayName?.trim() || null,
      bio: data.bio?.trim() || null,
      country: data.country?.trim().toUpperCase() || null,
    });
  }
}
