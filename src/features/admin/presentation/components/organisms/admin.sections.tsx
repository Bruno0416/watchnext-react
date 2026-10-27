import type { AdminSummary } from "../../../domain/entities/admin.summary";
import { ADMIN_SECTIONS } from "../../models/admin.state";
import { Stat } from "../atoms/stat";
import { AdminCard } from "../molecules/admin.card";

type AdminSectionsProps = {
  summary: AdminSummary | null;
};

const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" });

// grilla de accesos; los numeros salen si el resumen cargo
export function AdminSections({ summary }: AdminSectionsProps) {
  function stats(to: string) {
    if (!summary) return null;
    if (to === "/admin/usuarios") {
      return (
        <>
          <Stat value={summary.totalUsers} label="cuentas" />
          <Stat value={summary.admins} label="admin" />
          <Stat value={summary.pendingOnboarding} label="sin onboarding" />
        </>
      );
    }
    if (to === "/admin/noticias") {
      return (
        <>
          <Stat value={summary.totalNews} label="publicadas" />
          <Stat value={summary.lastNewsAt ? formatter.format(summary.lastNewsAt) : null} label="la ultima" />
        </>
      );
    }
    return null;
  }

  return (
    <div className="row g-3">
      {ADMIN_SECTIONS.map((s) => (
        <div key={s.to} className="col-12 col-md-6">
          <AdminCard section={s}>{stats(s.to)}</AdminCard>
        </div>
      ))}
    </div>
  );
}
