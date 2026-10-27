import { asFunction } from "awilix";

import type { AuthService } from "../../mock/auth/auth.service";
import { AuthStorage } from "../../mock/auth/auth.storage";
import { AuthRepositoryImpl } from "../../../features/auth/data/repositories/auth.repository.impl";
import type { AuthLocalSource } from "../../../features/auth/data/source/auth.local.source";
import { AuthLocalSourceImpl } from "../../../features/auth/data/source/auth.local.source.impl";
import { GetSession } from "../../../features/auth/domain/usecases/get.session";
import { Login } from "../../../features/auth/domain/usecases/login";
import { Logout } from "../../../features/auth/domain/usecases/logout";
import { Refresh } from "../../../features/auth/domain/usecases/refresh";
import { Register } from "../../../features/auth/domain/usecases/register";
import { RequestPasswordReset } from "../../../features/auth/domain/usecases/request.password.reset";
import { ResetPassword } from "../../../features/auth/domain/usecases/reset.password";
import { VerifyEmail } from "../../../features/auth/domain/usecases/verify.email";
import { VerifyResetCode } from "../../../features/auth/domain/usecases/verify.reset.code";

export const authFeatureDi = {
  // ---------- data source ----------
  authSource: asFunction(
    ({
      authService,
      authStorage,
    }: {
      authService: AuthService;
      authStorage: AuthStorage;
    }) => new AuthLocalSourceImpl(authService, authStorage),
  ).singleton(),

  // ---------- repository ----------
  authRepository: asFunction(
    ({ authSource }: { authSource: AuthLocalSource }) =>
      new AuthRepositoryImpl(authSource),
  ).singleton(),

  // ---------- usecases ----------
  login: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Login(authRepository),
  ).singleton(),

  register: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new Register(authRepository),
  ).singleton(),

  verifyEmail: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new VerifyEmail(authRepository),
  ).singleton(),

  requestPasswordReset: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new RequestPasswordReset(authRepository),
  ).singleton(),

  verifyResetCode: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new VerifyResetCode(authRepository),
  ).singleton(),

  resetPassword: asFunction(
    ({ authRepository }: { authRepository: AuthRepositoryImpl }) =>
      new ResetPassword(authRepository),
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
