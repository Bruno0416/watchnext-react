import type { ReactNode } from "react";

type UserStatusProps = {
  icon: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// cargando, vacio, error y no encontrado
export function UserStatus({ icon, title, description, children }: UserStatusProps) {
  return (
    <div className="um status" role="status">
      <i className={`bi bi-${icon} um status-icon`} aria-hidden="true" />
      <p className="um status-title">{title}</p>
      {description && <p className="um status-description">{description}</p>}
      {children}
    </div>
  );
}
