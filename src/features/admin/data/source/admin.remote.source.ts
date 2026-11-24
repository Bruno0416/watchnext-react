import type { AdminSummaryModel } from "../models/admin.summary.model";

// contrato con auth-service (cuentas) y news-service (noticias)
export interface AdminRemoteSource {
  getSummary(): Promise<AdminSummaryModel>;
}
