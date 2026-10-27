import { AdminUserRole } from "../../../domain/entities/admin.user";

type RoleBadgeProps = {
  role: AdminUserRole;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const admin = role === AdminUserRole.ADMIN;
  return (
    <span className={`um role ${admin ? "admin" : ""}`.trim()}>
      <i className={`bi bi-${admin ? "shield-lock-fill" : "person-fill"}`} aria-hidden="true" />
      {admin ? "Admin" : "Usuario"}
    </span>
  );
}
