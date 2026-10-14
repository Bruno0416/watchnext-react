import type { AuthRepository } from "../repositories/auth.repository";

export class RequestPasswordReset {
  constructor(private readonly repo: AuthRepository) {}

  async call(email: string): Promise<void> {
    return this.repo.requestPasswordReset(email);
  }
}
