import type { Profile } from "../entities/profile";
import type { ProfileRepository } from "../repositories/profile.repository";

export class GetMyProfile {
  constructor(private readonly repo: ProfileRepository) {}

  async call(): Promise<Profile> {
    return this.repo.getMine();
  }
}
