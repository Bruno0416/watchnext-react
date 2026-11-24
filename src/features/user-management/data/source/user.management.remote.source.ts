import type { AdminUserModel } from "../models/admin.user.model";

// contrato con los endpoints de admin de auth-service
export interface UserManagementRemoteSource {
  search(query: string): Promise<AdminUserModel[]>;
  getById(userId: string): Promise<AdminUserModel>;
  create(input: { email: string; password: string; role: "ADMIN" | "USER" }): Promise<AdminUserModel>;
  updateIdentity(userId: string, input: { username: string; displayName: string }): Promise<AdminUserModel>;
  delete(userId: string): Promise<void>;
}
