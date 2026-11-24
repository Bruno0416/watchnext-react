import type { OnboardingRequestModel } from "../models/onboarding.request.model";

export interface UserRemoteSource {
  checkOnboardingStatus(): Promise<boolean>;
  checkUsernameAvailable(username: string): Promise<boolean>;
  completeOnboarding(request: OnboardingRequestModel): Promise<void>;
}
