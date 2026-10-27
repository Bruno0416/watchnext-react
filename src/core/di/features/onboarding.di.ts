import { asFunction } from "awilix";
import { SearchService } from "../../mock/search/search.service";
import { ContentLocalSourceImpl } from "../../../features/onboarding/data/source/content.local.source.impl";
import type { UserService } from "../../mock/user/user.service";
import { UserLocalSourceImpl } from "../../../features/onboarding/data/source/user.local.source.impl";
import { ContentRepositoryImpl } from "../../../features/onboarding/data/repositories/content.repository.impl";
import { UserRepositoryImpl } from "../../../features/onboarding/data/repositories/user.repository.impl";
import { CheckOnboardingStatus } from "../../../features/onboarding/domain/usecases/check.onboarding.status";
import { CheckUsername } from "../../../features/onboarding/domain/usecases/check.username";
import { CompleteOnboarding } from "../../../features/onboarding/domain/usecases/complete.onboarding";
import { SearchContent } from "../../../features/onboarding/domain/usecases/search.content";

export const onboardingFeatureDi = {
  // ---------- data sources ----------
  contentSource: asFunction(
    ({ searchService }: { searchService: SearchService }) =>
      new ContentLocalSourceImpl(searchService),
  ),

  userSource: asFunction(
    ({ userService }: { userService: UserService }) =>
      new UserLocalSourceImpl(userService),
  ),

  // ---------- repositories ----------
  contentRepository: asFunction(
    ({ contentSource }: { contentSource: ContentLocalSourceImpl }) =>
      new ContentRepositoryImpl(contentSource),
  ),

  userRepository: asFunction(
    ({ userSource }: { userSource: UserLocalSourceImpl }) =>
      new UserRepositoryImpl(userSource),
  ),

  // ---------- usecases ----------
  checkOnboardingStatus: asFunction(
    ({ userRepository }: { userRepository: UserRepositoryImpl }) =>
      new CheckOnboardingStatus(userRepository),
  ),

  checkUsername: asFunction(
    ({ userRepository }: { userRepository: UserRepositoryImpl }) =>
      new CheckUsername(userRepository),
  ),

  completeOnboarding: asFunction(
    ({ userRepository }: { userRepository: UserRepositoryImpl }) =>
      new CompleteOnboarding(userRepository),
  ),

  searchContent: asFunction(
    ({ contentRepository }: { contentRepository: ContentRepositoryImpl }) =>
      new SearchContent(contentRepository),
  ),
};
