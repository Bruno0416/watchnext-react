import type { ReactNode } from "react";

type ListStatusProps = {
  icon: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// el mismo bloque me sirve para cargando, vacio, error y no encontrada
export function ListStatus({ icon, title, description, children }: ListStatusProps) {
  return (
    <div className="lists status" role="status">
      <i className={`bi bi-${icon} lists status-icon`} aria-hidden="true" />
      <p className="lists status-title">{title}</p>
      {description && <p className="lists status-description">{description}</p>}
      {children}
    </div>
  );
}
