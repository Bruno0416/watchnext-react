import type { SocialRepository } from "../repositories/social.repository";

export class AnswerFollowRequest {
  constructor(private readonly repo: SocialRepository) {}
  async call(username: string, accept: boolean): Promise<void> {
    return accept ? this.repo.acceptFollowRequest(username) : this.repo.rejectFollowRequest(username);
  }
}
