import type { AdminUser } from "../entities/admin.user";
import type { UserManagementRepository } from "../repositories/user.management.repository";

export class GetUserDetail {
  constructor(private readonly repo: UserManagementRepository) {}

  async call(userId: string): Promise<AdminUser> {
    return this.repo.getById(userId);
  }
}
