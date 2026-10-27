import type { ReactNode } from "react";
import { Link } from "react-router";

import type { Profile } from "../../../domain/entities/profile";
import { Avatar } from "../atoms/avatar";

type ProfileHeaderProps = {
  profile: Profile;
  isMine: boolean;
  onEdit: () => void;
  followSlot?: ReactNode; // boton de seguir cuando es el perfil de otro
};

export function ProfileHeader({ profile, isMine, onEdit, followSlot }: ProfileHeaderProps) {
  return (
    <header className="profile header">
      <Avatar url={profile.avatarUrl} initials={profile.initials} />

      <div className="profile header-info">
        <div className="profile header-top">
          <h1 className="profile name">{profile.shownName}</h1>
          <span className="profile badge">
            <i className={`bi bi-${profile.isPrivate ? "lock-fill" : "globe2"}`} aria-hidden="true" />
            {profile.isPrivate ? "Privado" : "Publico"}
          </span>
        </div>

        <p className="profile username">@{profile.username}</p>

        {profile.bio && <p className="profile bio">{profile.bio}</p>}

        <p className="profile meta">
          <Link to={`/perfil/${profile.username}/seguidores`}>
            <b>{profile.followersCount}</b> seguidores
          </Link>
          <Link to={`/perfil/${profile.username}/seguidos`}>
            <b>{profile.followingCount}</b> seguidos
          </Link>
        </p>
      </div>

      {isMine && (
        <div className="profile follow">
          <button type="button" className="btn btn-secondary profile edit-button" onClick={onEdit}>
            <i className="bi bi-pencil-fill" aria-hidden="true" />
            Editar perfil
          </button>
          {profile.isPrivate && (
            <Link to="/perfil/solicitudes" className="btn btn-outline-secondary">
              <i className="bi bi-person-lines-fill" aria-hidden="true" /> Solicitudes
            </Link>
          )}
        </div>
      )}
      {!isMine && followSlot}
    </header>
  );
}
