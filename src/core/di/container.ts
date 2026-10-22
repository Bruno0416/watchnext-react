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
import { extraMockDi } from "./mock/extra.di";

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

  // ---------- features ----------
  ...authFeatureDi,
  ...newsFeatureDi,
  ...listsFeatureDi,
  ...profileFeatureDi,
  ...newsManagementFeatureDi,
  ...userManagementFeatureDi,
  ...adminFeatureDi,
});
