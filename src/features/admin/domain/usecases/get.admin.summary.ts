import type { AdminSummary } from "../entities/admin.summary";
import type { AdminRepository } from "../repositories/admin.repository";

export class GetAdminSummary {
  constructor(private readonly repo: AdminRepository) {}

  async call(): Promise<AdminSummary> {
    return this.repo.getSummary();
  }
}
