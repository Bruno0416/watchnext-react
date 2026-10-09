import type { AuthRepository } from "../repositories/auth.repository";

export class Register {
  constructor(private repo: AuthRepository) {}

  async call(email: string, password: string) {
    return this.repo.register(email, password);
  }
}
