import { createContainer, InjectionMode } from "awilix";

import { authFeatureDi } from "./features/auth.di";
import { newsFeatureDi } from "./features/news.di";
import { listsFeatureDi } from "./features/lists.di";
import { profileFeatureDi } from "./features/profile.di";
import { newsManagementFeatureDi } from "./features/news.management.di";
import { userManagementFeatureDi } from "./features/user.management.di";
import { adminFeatureDi } from "./features/admin.di";
import { onboardingFeatureDi } from "./features/onboarding.di";
import { homeFeatureDi } from "./features/home.di";
import { mediaFeatureDi } from "./features/media.di";

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// ---------- registrar dependencias ----------
container.register({
  // ---------- features ----------
  ...authFeatureDi,
  ...onboardingFeatureDi,
  ...homeFeatureDi,
  ...mediaFeatureDi,
  ...newsFeatureDi,
  ...listsFeatureDi,
  ...profileFeatureDi,
  ...newsManagementFeatureDi,
  ...userManagementFeatureDi,
  ...adminFeatureDi,
});
