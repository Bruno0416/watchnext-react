import type { ReactNode } from "react";

type ProfileStatusProps = {
  icon: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// el mismo bloque para cargando, no encontrado, sin sesion y error
export function ProfileStatus({ icon, title, description, children }: ProfileStatusProps) {
  return (
    <div className="profile status" role="status">
      <i className={`bi bi-${icon} profile status-icon`} aria-hidden="true" />
      <p className="profile status-title">{title}</p>
      {description && <p className="profile status-description">{description}</p>}
      {children}
    </div>
  );
}
