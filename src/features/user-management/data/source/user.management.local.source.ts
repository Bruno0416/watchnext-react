import type { AdminUserModel } from "../models/admin.user.model";

// SIMULADO: el backend no tiene endpoint de admin, hoy es el mock AdminUsersService
export interface UserManagementLocalSource {
  search(query: string): Promise<AdminUserModel[]>;
  getById(userId: string): Promise<AdminUserModel>;
}
