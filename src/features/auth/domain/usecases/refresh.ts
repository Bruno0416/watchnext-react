import type { AuthTokens } from "../entities/auth.tokens";
import type { AuthRepository } from "../repositories/auth.repository";

export class Refresh {
  constructor(private repo: AuthRepository) {}

  async call(refreshToken: string): Promise<AuthTokens> {
    return this.repo.refresh(refreshToken);
  }
}
