import type { AdminSummary } from "../entities/admin.summary";

export interface AdminRepository {
  getSummary(): Promise<AdminSummary>;
}
