import { asFunction } from "awilix";

import type { AuthDb } from "../../mock/auth/auth.db";
import type { AuthStorage } from "../../mock/auth/auth.storage";
import type { ProfileDb } from "../../mock/user/profile.db";
import type { ListDb } from "../../mock/list/list.db";
import type { FeedbackDb } from "../../mock/feedback/feedback.db";
import { SocialService } from "../../mock/user/social.service";
import { AdminUsersService } from "../../mock/admin/admin.users.service";

// mocks que agregue para HU 11 y HU 15, aparte para no tocar los di de Bruno
export const extraMockDi = {
  socialService: asFunction(
    ({ profileDb, authStorage }: { profileDb: ProfileDb; authStorage: AuthStorage }) =>
      new SocialService(profileDb, authStorage),
  ).singleton(),

  adminUsersService: asFunction(
    ({ authDb, profileDb, authStorage, listDb, feedbackDb }: { authDb: AuthDb; profileDb: ProfileDb; authStorage: AuthStorage; listDb: ListDb; feedbackDb: FeedbackDb }) =>
      new AdminUsersService(authDb, profileDb, authStorage, listDb, feedbackDb),
  ).singleton(),
};
