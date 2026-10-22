import type { AdminUser } from "../entities/admin.user";

// solo lectura: la HU no pide bloquear, borrar ni cambiar roles
export interface UserManagementRepository {
  search(query: string): Promise<AdminUser[]>;
  getById(userId: string): Promise<AdminUser>;
}
