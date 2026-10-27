import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import type { AdminUser } from "../../../domain/entities/admin.user";
import { RoleBadge } from "../atoms/role.badge";

type UserDetailCardProps = {
  user: AdminUser;
  onSave: (input: { username: string; displayName: string }) => Promise<void>;
};

const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" });

export function UserDetailCard({ user, onSave }: UserDetailCardProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [displayName, setDisplayName] = useState(user.props.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError(null);
    setSaving(true);
    try {
      await onSave({ username, displayName });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="um sheet">
      <header className="um card-head">
        <h1 className="um card-title">{user.shownName}</h1>
        <RoleBadge role={user.role} />
      </header>

      <dl className="um data">
        {filas.map(([k, v]) => (
          <div key={k} className="um data-row"><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      {user.onboardingCompleted ? (
        <form className="um identity-form" onSubmit={submit}>
          <h2 className="um form-title">Corregir identidad</h2>
          <div className="um form-grid">
            <label className="um field">Nombre de usuario
              <div className="input-group">
                <span className="input-group-text">@</span>
                <input className="form-control" type="text" required minLength={3} maxLength={30} pattern="[a-z0-9_]{3,30}" value={username} onChange={(e) => setUsername(e.target.value)} disabled={saving}/>
              </div>
            </label>
            <label className="um field">Nombre visible
              <input className="form-control" type="text" maxLength={50} value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={saving}/>
            </label>
          </div>
          {error && <p className="um form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={saving || (username === (user.username ?? "") && displayName === (user.props.displayName ?? ""))}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      ) : (
        <p className="um field-help">La cuenta no tiene perfil asociado. Los usuarios normales pueden completarlo en el onboarding.</p>
      )}

      {user.username && (
        <Link to={`/perfil/${user.username}`} className="btn btn-outline-primary">
          <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> Ver perfil publico
        </Link>
      )}
    </article>
  );
}
