import type { RelationshipStatus } from "../entities/relationship";
import type { SocialRepository } from "../repositories/social.repository";

export class FollowUser {
  constructor(private readonly repo: SocialRepository) {}
  async call(username: string): Promise<RelationshipStatus> {
    return this.repo.follow(username);
  }
}
