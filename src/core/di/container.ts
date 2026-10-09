import { createContainer, InjectionMode } from "awilix";

import { authFeatureDi } from "./features/auth.di";
import { authMockDi } from "./mock/auth.di";
import { feedbackMockDi } from "./mock/feedback.di";
import { listsMockDi } from "./mock/lists.di";
import { newsMockDi } from "./mock/news.di";
import { profileMockDi } from "./mock/profile.di";

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// ----- registrar dependencias -----
container.register({
  // ---- mocks ----
  ...authMockDi,
  ...profileMockDi,
  ...listsMockDi,
  ...feedbackMockDi,
  ...newsMockDi,

  // ---- features ----
  ...authFeatureDi,
});
