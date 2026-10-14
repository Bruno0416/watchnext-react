import type { AuthRepository } from "../repositories/auth.repository";

export class VerifyResetCode {
  constructor(private readonly repo: AuthRepository) {}

  async call(email: string, code: string): Promise<string> {
    return this.repo.verifyResetCode(email, code);
  }
}
