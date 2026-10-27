import type { AuthRepository } from "../repositories/auth.repository";

export class ResetPassword {
  constructor(private readonly repo: AuthRepository) {}

  async call(resetToken: string, newPassword: string): Promise<void> {
    return this.repo.resetPassword(resetToken, newPassword);
  }
}
