import { asFunction } from "awilix";

import type { AdminRemoteSource } from "../../../features/admin/data/source/admin.remote.source";
import { AdminRemoteSourceImpl } from "../../../features/admin/data/source/admin.remote.source.impl";
import { AdminRepositoryImpl } from "../../../features/admin/data/repositories/admin.repository.impl";
import type { AdminRepository } from "../../../features/admin/domain/repositories/admin.repository";
import { GetAdminSummary } from "../../../features/admin/domain/usecases/get.admin.summary";

export const adminFeatureDi = {
  // ------- data source -------
  adminSource: asFunction(() => new AdminRemoteSourceImpl()).singleton(),

  // ------- repository -------
  adminRepository: asFunction(
    ({ adminSource }: { adminSource: AdminRemoteSource }) => new AdminRepositoryImpl(adminSource),
  ).singleton(),

  // ------- usecases -------
  getAdminSummary: asFunction(
    ({ adminRepository }: { adminRepository: AdminRepository }) => new GetAdminSummary(adminRepository),
  ).singleton(),
};
