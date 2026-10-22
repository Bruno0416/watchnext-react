import type { AdminUsersService } from "../../../../core/mock/admin/admin.users.service";
import { UserManagementError } from "../errors/user.management.errors";
import { AdminUserModel } from "../models/admin.user.model";
import type { UserManagementLocalSource } from "./user.management.local.source";

export class UserManagementLocalSourceImpl implements UserManagementLocalSource {
  constructor(private readonly service: AdminUsersService) {}

  async search(query: string): Promise<AdminUserModel[]> {
    const json = await this.service.list(query);
    return json.map((j) => AdminUserModel.fromJson(j));
  }

  async getById(userId: string): Promise<AdminUserModel> {
    const json = await this.service.get(userId);
    // no existe: 404 como el backend
    if (!json) throw new UserManagementError(404);
    return AdminUserModel.fromJson(json);
  }
}
