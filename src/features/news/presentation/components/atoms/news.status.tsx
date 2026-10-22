import type { ReactNode } from "react";

type NewsStatusProps = {
  icon: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// el mismo bloque me sirve para cargando, vacio, error y no encontrada
export function NewsStatus({
  icon,
  title,
  description,
  children,
}: NewsStatusProps) {
  return (
    <div className="news status" role="status">
      <i className={`bi bi-${icon} news status-icon`} aria-hidden="true" />
      <p className="news status-title">{title}</p>
      {description && <p className="news status-description">{description}</p>}
      {children}
    </div>
  );
}
