import type { UserRepository } from "../repositories/user.repository";

export class CheckOnboardingStatus {
  constructor(private readonly repository: UserRepository) {}

  call(): Promise<boolean> {
    return this.repository.checkOnboardingStatus();
  }
}
