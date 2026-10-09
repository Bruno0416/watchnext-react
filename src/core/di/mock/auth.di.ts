import { asClass, asFunction } from "awilix";

import { AuthDb } from "../../mock/auth/auth.db";
import { AuthService } from "../../mock/auth/auth.service";
import { AuthStorage } from "../../mock/auth/auth.storage";

export const authMockDi = {
  authDb: asClass(AuthDb).singleton(),

  authStorage: asClass(AuthStorage).singleton(),

  authService: asFunction(
    ({ authDb, authStorage }: { authDb: AuthDb; authStorage: AuthStorage }) =>
      new AuthService(authDb, authStorage),
  ).singleton(),
};
