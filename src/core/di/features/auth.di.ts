import { asFunction } from "awilix";

import type { AuthService } from "../../mock/auth/auth.service";
import type { AuthLocalSource } from "../../../features/auth/data/source/auth.local.source";
import { AuthLocalSourceImpl } from "../../../features/auth/data/source/auth.local.source.impl";
import { AuthRepositoryImpl } from "../../../features/auth/data/repositories/auth.repository.impl";

import { Login } from "../../../features/auth/domain/usecases/login";
import { Register } from "../../../features/auth/domain/usecases/register";
import { Refresh } from "../../../features/auth/domain/usecases/refresh";
import { Logout } from "../../../features/auth/domain/usecases/logout";
import { AuthStorage } from "../../mock/auth/auth.storage";
import { GetSession } from "../../../features/auth/domain/usecases/get.session";

export const authFeatureDi = {
  // ------- data source -------
  authSource: asFunction(
    ({
      authService,
      authStorage,
    }: {
      authService: AuthService;
      authStorage: AuthStorage;
    }) => new AuthLocalSourceImpl(authService, authStorage),
  ).singleton(),

  // ------- repository -------
  authRepository: asFunction(
    ({ authSource }: { authSource: AuthLocalSource }) =>
      new AuthRepositoryImpl(authSource),
  ).singleton(),

  // ------- usecases -------
  login: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Login(authRepository),
  ).singleton(),

  register: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Register(authRepository),
  ).singleton(),

  refresh: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Refresh(authRepository),
  ).singleton(),

  logout: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Logout(authRepository),
  ).singleton(),

  getSession: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new GetSession(authRepository),
  ).singleton(),
};
