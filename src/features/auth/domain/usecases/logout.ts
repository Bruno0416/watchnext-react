import type { AuthRepository } from "../repositories/auth.repository";

export class Logout {
  constructor(private repo: AuthRepository) {}

  async call() {
    return this.repo.logout();
  }
}
