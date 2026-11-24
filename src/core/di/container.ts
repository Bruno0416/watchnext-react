import { createContainer, InjectionMode } from "awilix";

import { authFeatureDi } from "./features/auth.di";
import { newsFeatureDi } from "./features/news.di";
import { listsFeatureDi } from "./features/lists.di";
import { profileFeatureDi } from "./features/profile.di";
import { newsManagementFeatureDi } from "./features/news.management.di";
import { userManagementFeatureDi } from "./features/user.management.di";
import { adminFeatureDi } from "./features/admin.di";
import { authMockDi } from "./mock/auth.di";
import { contentMockDi } from "./mock/content.di";
import { feedbackMockDi } from "./mock/feedback.di";
import { listMockDi } from "./mock/list.di";
import { newsMockDi } from "./mock/news.di";
import { searchMockDi } from "./mock/search.di";
import { userMockDi } from "./mock/user.di";
import { onboardingFeatureDi } from "./features/onboarding.di";
import { homeFeatureDi } from "./features/home.di";
import { mediaFeatureDi } from "./features/media.di";
import { extraMockDi } from "./mock/extra.di";
import { apiDi } from "./api/api.di";
import { USE_API } from "../api/api.config";

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// ---------- registrar dependencias ----------
container.register({
  // ---------- mocks ----------
  ...authMockDi,
  ...contentMockDi,
  ...feedbackMockDi,
  ...listMockDi,
  ...newsMockDi,
  ...searchMockDi,
  ...userMockDi,
  ...extraMockDi,

  // ---------- microservicios (reemplazan a los mocks con VITE_USE_API=true) ----------
  ...(USE_API ? apiDi : {}),

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
