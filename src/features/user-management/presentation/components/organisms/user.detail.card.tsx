import { Link } from "react-router";

import type { AdminUser } from "../../../domain/entities/admin.user";
import { RoleBadge } from "../atoms/role.badge";

type UserDetailCardProps = {
  user: AdminUser;
};

const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" });

// ficha de solo lectura; nunca muestro la contraseña (el servicio ni la manda)
export function UserDetailCard({ user }: UserDetailCardProps) {
  const filas: [string, string][] = [
    ["Correo", user.email],
    ["Usuario", user.username ? `@${user.username}` : "Sin definir"],
    ["Pais", user.country ?? "Sin definir"],
    ["Perfil", user.isPrivate ? "Privado" : "Publico"],
    ["Correo verificado", user.emailVerified ? "Si" : "No"],
    ["Onboarding", user.onboardingCompleted ? "Completo" : "Pendiente"],
    ["Seguidores", String(user.followersCount)],
    ["Seguidos", String(user.followingCount)],
    ["Favoritos", String(user.favoritesCount)],
    ["Creado", user.createdAt ? formatter.format(user.createdAt) : "Sin dato"],
  ];

  return (
    <article className="um sheet">
      <header className="um card-head">
        <h1 className="um card-title">{user.shownName}</h1>
        <RoleBadge role={user.role} />
      </header>

      <dl className="um data">
        {filas.map(([k, v]) => (
          <div key={k} className="um data-row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      {user.username && (
        <Link to={`/perfil/${user.username}`} className="btn btn-outline-primary">
          <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> Ver perfil publico
        </Link>
      )}
    </article>
  );
}
