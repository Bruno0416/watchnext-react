import type { ReactNode } from "react";
import { Link } from "react-router";

import type { ProfileSummary } from "../../../domain/entities/profile.summary";
import { Avatar } from "../atoms/avatar";

type PersonRowProps = {
  person: ProfileSummary;
  children?: ReactNode; // botones extra, ej: aceptar / rechazar
};

// una persona en las listas de seguidores, seguidos o solicitudes
export function PersonRow({ person, children }: PersonRowProps) {
  return (
    <li className="profile person">
      <Link to={`/perfil/${person.username}`} className="profile person-link">
        <Avatar url={person.avatarUrl} initials={person.initials} size="md" />
        <span className="profile person-names">
          <span className="profile person-name">
            {person.shownName}
            {person.isPrivate && <i className="bi bi-lock-fill ms-1" aria-label="perfil privado" />}
          </span>
          <span className="profile person-username">@{person.username}</span>
        </span>
      </Link>
      {children && <div className="profile person-actions">{children}</div>}
    </li>
  );
}
