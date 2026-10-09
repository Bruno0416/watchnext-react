import type { AuthTokens } from "../entities/auth.tokens";
import type { AuthRepository } from "../repositories/auth.repository";

export class Login {
  constructor(private repo: AuthRepository) {}

  async call(email: string, password: string): Promise<AuthTokens> {
    return this.repo.login(email, password);
  }
}
