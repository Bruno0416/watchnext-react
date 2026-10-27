import type { Relationship } from "../entities/relationship";
import type { SocialRepository } from "../repositories/social.repository";

export class GetRelationship {
  constructor(private readonly repo: SocialRepository) {}
  async call(username: string): Promise<Relationship> {
    return this.repo.getRelationship(username);
  }
}
