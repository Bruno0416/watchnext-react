import type { ReactNode } from "react";

type ManagementStatusProps = {
  icon: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// bloque para cargando, vacio y error de la tabla
export function ManagementStatus({ icon, title, description, children }: ManagementStatusProps) {
  return (
    <div className="nm status" role="status">
      <i className={`bi bi-${icon} nm status-icon`} aria-hidden="true" />
      <p className="nm status-title">{title}</p>
      {description && <p className="nm status-description">{description}</p>}
      {children}
    </div>
  );
}
