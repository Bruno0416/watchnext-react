import type { AdminSummary } from "../../domain/entities/admin.summary";
import type { AdminRepository } from "../../domain/repositories/admin.repository";
import { AdminSummaryUnavailableException } from "../errors/admin.exceptions";
import type { AdminLocalSource } from "../source/admin.local.source";

export class AdminRepositoryImpl implements AdminRepository {
  constructor(private readonly source: AdminLocalSource) {}

  async getSummary(): Promise<AdminSummary> {
    try {
      return (await this.source.getSummary()).toDomain();
    } catch (e) {
      console.error(e);
      throw new AdminSummaryUnavailableException();
    }
  }
}
