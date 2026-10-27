import { asFunction } from "awilix";

import type { AdminUsersService } from "../../mock/admin/admin.users.service";
import type { UserManagementLocalSource } from "../../../features/user-management/data/source/user.management.local.source";
import { UserManagementLocalSourceImpl } from "../../../features/user-management/data/source/user.management.local.source.impl";
import { UserManagementRepositoryImpl } from "../../../features/user-management/data/repositories/user.management.repository.impl";
import type { UserManagementRepository } from "../../../features/user-management/domain/repositories/user.management.repository";

import { SearchUsers } from "../../../features/user-management/domain/usecases/search.users";
import { GetUserDetail } from "../../../features/user-management/domain/usecases/get.user.detail";
import { CreateUser } from "../../../features/user-management/domain/usecases/create.user";
import { UpdateUserIdentity } from "../../../features/user-management/domain/usecases/update.user.identity";
import { DeleteUser } from "../../../features/user-management/domain/usecases/delete.user";

type R = { userManagementRepository: UserManagementRepository };

export const userManagementFeatureDi = {
  // ------- data source -------
  userManagementSource: asFunction(
    ({ adminUsersService }: { adminUsersService: AdminUsersService }) =>
      new UserManagementLocalSourceImpl(adminUsersService),
  ).singleton(),

  // ------- repository -------
  userManagementRepository: asFunction(
    ({ userManagementSource }: { userManagementSource: UserManagementLocalSource }) =>
      new UserManagementRepositoryImpl(userManagementSource),
  ).singleton(),

  // ------- usecases -------
  searchUsers: asFunction(({ userManagementRepository }: R) => new SearchUsers(userManagementRepository)).singleton(),
  getUserDetail: asFunction(({ userManagementRepository }: R) => new GetUserDetail(userManagementRepository)).singleton(),
  createUser: asFunction(({ userManagementRepository }: R) => new CreateUser(userManagementRepository)).singleton(),
  updateUserIdentity: asFunction(({ userManagementRepository }: R) => new UpdateUserIdentity(userManagementRepository)).singleton(),
  deleteUser: asFunction(({ userManagementRepository }: R) => new DeleteUser(userManagementRepository)).singleton(),
};
