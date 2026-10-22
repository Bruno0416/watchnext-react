import type { AdminSummaryModel } from "../models/admin.summary.model";

// SIMULADO: hoy junta AdminUsersService y NewsService del mock
export interface AdminLocalSource {
  getSummary(): Promise<AdminSummaryModel>;
}
