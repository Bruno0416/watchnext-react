import type { Profile } from "../../../domain/entities/profile";
import { nombrePais } from "../../validators/profile.validator";
import { Avatar } from "../atoms/avatar";

type ProfileHeaderProps = {
  profile: Profile;
  isMine: boolean;
  onEdit: () => void;
};

export function ProfileHeader({ profile, isMine, onEdit }: ProfileHeaderProps) {
  const pais = nombrePais(profile.country);

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
          {pais && (
            <span>
              <i className="bi bi-geo-alt-fill" aria-hidden="true" /> {pais}
            </span>
          )}
          <span>
            <b>{profile.followersCount}</b> seguidores
          </span>
          <span>
            <b>{profile.followingCount}</b> seguidos
          </span>
        </p>
      </div>

      {isMine && (
        <button type="button" className="btn btn-secondary profile edit-button" onClick={onEdit}>
          <i className="bi bi-pencil-fill" aria-hidden="true" />
          Editar perfil
        </button>
      )}
    </header>
  );
}
