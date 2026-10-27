import type { UserRepository } from "../repositories/user.repository";
import type { OnboardingData } from "../entities/onboarding.data";

export class CompleteOnboarding {
  constructor(private readonly repo: UserRepository) {}

  async call(data: OnboardingData): Promise<void> {
    await this.repo.completeOnboarding(data);
  }
}
