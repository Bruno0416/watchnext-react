import type { SocialRepository } from "../repositories/social.repository";

export class UnfollowUser {
  constructor(private readonly repo: SocialRepository) {}
  async call(username: string): Promise<void> {
    return this.repo.unfollow(username);
  }
}
