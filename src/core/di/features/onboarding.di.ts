import { asFunction } from "awilix";
import { ContentRemoteSourceImpl } from "../../../features/onboarding/data/source/content.remote.source.impl";
import { UserRemoteSourceImpl } from "../../../features/onboarding/data/source/user.remote.source.impl";
import type { ContentLocalSource } from "../../../features/onboarding/data/source/content.local.source";
import type { UserLocalSource } from "../../../features/onboarding/data/source/user.local.source";
import { ContentRepositoryImpl } from "../../../features/onboarding/data/repositories/content.repository.impl";
import { UserRepositoryImpl } from "../../../features/onboarding/data/repositories/user.repository.impl";
import { CheckOnboardingStatus } from "../../../features/onboarding/domain/usecases/check.onboarding.status";
import { CheckUsername } from "../../../features/onboarding/domain/usecases/check.username";
import { CompleteOnboarding } from "../../../features/onboarding/domain/usecases/complete.onboarding";
import { SearchContent } from "../../../features/onboarding/domain/usecases/search.content";

export const onboardingFeatureDi = {
  // ---------- data sources ----------
  contentSource: asFunction(() => new ContentRemoteSourceImpl()),

  userSource: asFunction(() => new UserRemoteSourceImpl()),

  // ---------- repositories ----------
  contentRepository: asFunction(
    ({ contentSource }: { contentSource: ContentLocalSource }) =>
      new ContentRepositoryImpl(contentSource),
  ),

  userRepository: asFunction(
    ({ userSource }: { userSource: UserLocalSource }) =>
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
