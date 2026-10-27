import type { ProfileSummary } from "../entities/profile.summary";
import type { SocialRepository } from "../repositories/social.repository";

export class GetFollowRequests {
  constructor(private readonly repo: SocialRepository) {}
  async call(): Promise<ProfileSummary[]> {
    return this.repo.getMyFollowRequests();
  }
}
