import type { ProfileSummary } from "../entities/profile.summary";
import type { SocialRepository } from "../repositories/social.repository";

export class GetFollowing {
  constructor(private readonly repo: SocialRepository) {}
  async call(username: string): Promise<ProfileSummary[]> {
    return this.repo.getFollowing(username);
  }
}
