import type { OnboardingData } from "../entities/onboarding.data";

export interface UserRepository {
  checkOnboardingStatus(): Promise<boolean>;
  checkUsernameAvailable(username: string): Promise<boolean>;
  completeOnboarding(data: OnboardingData): Promise<void>;
}
