import { createContainer, InjectionMode } from "awilix";

import { authFeatureDi } from "./features/auth.di";
import { authMockDi } from "./mock/auth.di";
import { contentMockDi } from "./mock/content.di";
import { feedbackMockDi } from "./mock/feedback.di";
import { listMockDi } from "./mock/list.di";
import { newsMockDi } from "./mock/news.di";
import { searchMockDi } from "./mock/search.di";
import { userMockDi } from "./mock/user.di";

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

  // ---------- features ----------
  ...authFeatureDi,
});
