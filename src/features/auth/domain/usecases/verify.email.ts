import type { AuthRepository } from "../repositories/auth.repository";

export class VerifyEmail {
  constructor(private repo: AuthRepository) {}

  async call(email: string, code: string) {
    return this.repo.verifyEmail(email, code);
  }
}
