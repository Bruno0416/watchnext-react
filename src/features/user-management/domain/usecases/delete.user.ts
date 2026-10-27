import type { UserManagementRepository } from "../repositories/user.management.repository";

export class DeleteUser {
  constructor(private readonly repo: UserManagementRepository) {}

  async call(userId: string): Promise<void> {
    return this.repo.delete(userId);
  }
}
