import type { Profile } from "../entities/profile";
import type { ProfileRepository } from "../repositories/profile.repository";

export class GetProfile {
  constructor(private readonly repo: ProfileRepository) {}

  async call(username: string): Promise<Profile> {
    return this.repo.getByUsername(username.trim());
  }
}
