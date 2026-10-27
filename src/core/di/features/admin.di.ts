import { asFunction } from "awilix";

import type { AdminUsersService } from "../../mock/admin/admin.users.service";
import type { NewsService } from "../../mock/news/news.service";
import type { AdminLocalSource } from "../../../features/admin/data/source/admin.local.source";
import { AdminLocalSourceImpl } from "../../../features/admin/data/source/admin.local.source.impl";
import { AdminRepositoryImpl } from "../../../features/admin/data/repositories/admin.repository.impl";
import type { AdminRepository } from "../../../features/admin/domain/repositories/admin.repository";
import { GetAdminSummary } from "../../../features/admin/domain/usecases/get.admin.summary";

export const adminFeatureDi = {
  // ------- data source -------
  adminSource: asFunction(
    ({ adminUsersService, newsService }: { adminUsersService: AdminUsersService; newsService: NewsService }) =>
      new AdminLocalSourceImpl(adminUsersService, newsService),
  ).singleton(),

  // ------- repository -------
  adminRepository: asFunction(
    ({ adminSource }: { adminSource: AdminLocalSource }) => new AdminRepositoryImpl(adminSource),
  ).singleton(),

  // ------- usecases -------
  getAdminSummary: asFunction(
    ({ adminRepository }: { adminRepository: AdminRepository }) => new GetAdminSummary(adminRepository),
  ).singleton(),
};
