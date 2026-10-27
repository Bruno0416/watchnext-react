import type { AdminUser } from "../../domain/entities/admin.user";
import type { UserManagementRepository } from "../../domain/repositories/user.management.repository";
import { UserManagementError } from "../errors/user.management.errors";
import {
  AdminUserNotFoundException,
  UserManagementUnavailableException,
} from "../errors/user.management.exceptions";
import type { UserManagementLocalSource } from "../source/user.management.local.source";

export class UserManagementRepositoryImpl implements UserManagementRepository {
  constructor(private readonly source: UserManagementLocalSource) {}

  async search(query: string): Promise<AdminUser[]> {
    try {
      const models = await this.source.search(query);
      // los admin primero y despues por nombre
      return models
        .map((m) => m.toDomain())
        .sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin) || a.shownName.localeCompare(b.shownName, "es"));
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async getById(userId: string): Promise<AdminUser> {
    try {
      return (await this.source.getById(userId)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async create(input: { email: string; password: string; role: "ADMIN" | "USER" }): Promise<AdminUser> {
    try {
      return (await this.source.create(input)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async updateIdentity(userId: string, input: { username: string; displayName: string }): Promise<AdminUser> {
    try {
      return (await this.source.updateIdentity(userId, input)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.source.delete(userId);
    } catch (e) {
      throw this.mapError(e);
    }
  }

  // ---- helper ----
  private mapError(e: unknown): Error {
    if (e instanceof UserManagementError && e.status === 404) return new AdminUserNotFoundException();
    if (e instanceof Error && !(e instanceof UserManagementError)) return e;
    console.error(e);
    return new UserManagementUnavailableException();
  }
}
