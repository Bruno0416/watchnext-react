import type { UserManagementRepository } from "../repositories/user.management.repository";

export class UpdateUserIdentity {
  constructor(private readonly repo: UserManagementRepository) {}

  async call(userId: string, input: { username: string; displayName: string }) {
    return this.repo.updateIdentity(userId, input);
  }
}
