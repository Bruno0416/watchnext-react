import type { AdminUser } from "../entities/admin.user";

// consulta, alta de cuentas y actualizacion acotada de identidad
export interface UserManagementRepository {
  search(query: string): Promise<AdminUser[]>;
  getById(userId: string): Promise<AdminUser>;
  create(input: { email: string; password: string; role: "ADMIN" | "USER" }): Promise<AdminUser>;
  updateIdentity(userId: string, input: { username: string; displayName: string }): Promise<AdminUser>;
  delete(userId: string): Promise<void>;
}
