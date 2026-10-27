import { Link } from "react-router";

import type { AdminUser } from "../../../domain/entities/admin.user";
import { RoleBadge } from "../atoms/role.badge";

type UserRowProps = {
  user: AdminUser;
};

// una fila; toda la fila lleva al detalle
export function UserRow({ user }: UserRowProps) {
  return (
    <li>
      <Link to={`/admin/usuarios/${user.userId}`} className="um item">
        <span className="um row-names">
          <span className="um row-name">{user.shownName}</span>
          <span className="um row-email">
            {user.username ? `@${user.username} · ` : ""}
            {user.email}
          </span>
        </span>
        <span className="um row-tags">
          {!user.onboardingCompleted && <span className="um tag">Sin onboarding</span>}
          <RoleBadge role={user.role} />
          <i className="bi bi-chevron-right" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}
