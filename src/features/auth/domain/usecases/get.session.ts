import type { AuthSession } from "../entities/auth.session";
import type { AuthRepository } from "../repositories/auth.repository";

export class GetSession {
  constructor(private readonly repo: AuthRepository) {}

  async call(): Promise<AuthSession | null> {
    return this.repo.getSession();
  }
}
