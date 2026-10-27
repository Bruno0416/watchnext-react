import type { UserManagementRepository } from "../repositories/user.management.repository";

export class CreateUser {
  constructor(private readonly repo: UserManagementRepository) {}

  async call(input: { email: string; password: string; role: "ADMIN" | "USER" }) {
    return this.repo.create(input);
  }
}
