import type { ReactNode } from "react";
import { Link } from "react-router";

import type { AdminSection } from "../../models/admin.state";

type AdminCardProps = {
  section: AdminSection;
  children?: ReactNode; // los numeros de esa seccion
};

// tarjeta que lleva a una seccion del admin
export function AdminCard({ section, children }: AdminCardProps) {
  return (
    <Link to={section.to} className="admin tile">
      <span className="admin card-icon">
        <i className={`bi bi-${section.icon}`} aria-hidden="true" />
      </span>
      <span className="admin card-body">
        <span className="admin card-title">{section.title}</span>
        <span className="admin card-description">{section.description}</span>
      </span>
      {children && <span className="admin card-stats">{children}</span>}
      <i className="bi bi-arrow-right admin card-arrow" aria-hidden="true" />
    </Link>
  );
}
