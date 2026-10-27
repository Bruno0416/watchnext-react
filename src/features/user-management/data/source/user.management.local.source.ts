import type { AdminUserModel } from "../models/admin.user.model";

// SIMULADO: el backend no tiene endpoint de admin, hoy es el mock AdminUsersService
export interface UserManagementLocalSource {
  search(query: string): Promise<AdminUserModel[]>;
  getById(userId: string): Promise<AdminUserModel>;
  create(input: { email: string; password: string; role: "ADMIN" | "USER" }): Promise<AdminUserModel>;
  updateIdentity(userId: string, input: { username: string; displayName: string }): Promise<AdminUserModel>;
  delete(userId: string): Promise<void>;
}
