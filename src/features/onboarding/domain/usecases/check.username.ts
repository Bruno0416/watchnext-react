import type { UserRepository } from "../repositories/user.repository";

export class CheckUsername {
  constructor(private readonly repo: UserRepository) {}

  async call(username: string): Promise<boolean> {
    return this.repo.checkUsernameAvailable(username);
  }
}
