import type { AdminUser } from "../entities/admin.user";
import type { UserManagementRepository } from "../repositories/user.management.repository";

export class SearchUsers {
  constructor(private readonly repo: UserManagementRepository) {}

  // texto vacio = todos
  async call(query: string): Promise<AdminUser[]> {
    return this.repo.search(query.trim());
  }
}
