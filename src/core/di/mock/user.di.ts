import { asClass, asFunction } from "awilix";

import type { AuthStorage } from "../../mock/auth/auth.storage";
import type { ContentService } from "../../mock/content/content.service";
import { ProfileDb } from "../../mock/user/profile.db";
import { ProfileStorage } from "../../mock/user/profile.storage";
import { UserService } from "../../mock/user/user.service";

function createProfileDb({
  profileStorage,
}: {
  profileStorage: ProfileStorage;
}) {
  return new ProfileDb(profileStorage);
}

function createUserService({
  profileDb,
  authStorage,
  contentService,
}: {
  profileDb: ProfileDb;
  authStorage: AuthStorage;
  contentService: ContentService;
}) {
  return new UserService(profileDb, authStorage, contentService);
}

export const userMockDi = {
  profileStorage: asClass(ProfileStorage).singleton(),
  profileDb: asFunction(createProfileDb).singleton(),
  userService: asFunction(createUserService).singleton(),
};
