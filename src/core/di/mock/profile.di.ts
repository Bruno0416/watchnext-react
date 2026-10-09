import { asClass, asFunction } from "awilix";

import { ProfileDb } from "../../mock/profile/profile.db";
import { ProfileService } from "../../mock/profile/profile.service";
import { ProfileStorage } from "../../mock/profile/profile.storage";

function createProfileDb({
  profileStorage,
}: {
  profileStorage: ProfileStorage;
}) {
  return new ProfileDb(profileStorage);
}

function createProfileService({ profileDb }: { profileDb: ProfileDb }) {
  return new ProfileService(profileDb);
}

export const profileMockDi = {
  profileStorage: asClass(ProfileStorage).singleton(),
  profileDb: asFunction(createProfileDb).singleton(),
  profileService: asFunction(createProfileService).singleton(),
};
