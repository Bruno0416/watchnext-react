import { ProfileVisibility } from "../../../../../core/models/profile.visibility";
import { BIO_MAX, DISPLAY_NAME_MAX } from "../../../../../core/models/supported.countries";
import { UsernameStatus } from "../../models/onboarding.state";

type ProfileStepProps = {
  username: string;
  usernameError: string | null;
  usernameStatus: UsernameStatus;

  displayName: string;
  displayNameError: string | null;

  bio: string;
  bioError: string | null;

  visibility: ProfileVisibility;

  onUsernameChange: (value: string) => void;
  onUsernameBlur: () => void;

  onDisplayNameChange: (value: string) => void;
  onDisplayNameBlur: () => void;

  onBioChange: (value: string) => void;
  onBioBlur: () => void;

  onVisibilityChange: (value: ProfileVisibility) => void;

  onBack: () => void;
  onContinue: () => void;
};

export function ProfileStep({
  username,
  usernameError,
  usernameStatus,
  displayName,
  displayNameError,
  bio,
  bioError,
  visibility,
  onUsernameChange,
  onUsernameBlur,
  onDisplayNameChange,
  onDisplayNameBlur,
  onBioChange,
  onBioBlur,
  onVisibilityChange,
  onBack,
  onContinue,
}: ProfileStepProps) {
  return (
    <section className="onboarding step profile">
      <header className="onboarding section header">
        <span className="onboarding eyebrow">Tu identidad</span>
        <h1>Crea tu perfil</h1>

        <p>
          Esta información será la que otros usuarios podrán ver en WatchNext.
        </p>
      </header>

      <div className="onboarding fields profile">
        <div className="onboarding field username">
          <label className="form-label" htmlFor="username">
            Nombre de usuario
          </label>

          <div className="input-group onboarding username-control">
            <span className="input-group-text" aria-hidden="true">@</span>
            <input
              id="username"
              className="form-control onboarding input"
              type="text"
              autoComplete="username"
              value={username}
              placeholder="nombre_usuario"
              onChange={(event) => onUsernameChange(event.target.value)}
              onBlur={onUsernameBlur}
            />
          </div>

          {usernameError && (
            <p className="text-danger small mb-0 mt-1">{usernameError}</p>
          )}

          {!usernameError && usernameStatus === UsernameStatus.LOADING && (
            <p className="onboarding field status">
              Comprobando disponibilidad...
            </p>
          )}

          {!usernameError && usernameStatus === UsernameStatus.AVAILABLE && (
            <p className="onboarding field status success">
              Nombre de usuario disponible
            </p>
          )}

          {!usernameError && usernameStatus === UsernameStatus.TAKEN && (
            <p className="text-danger small mb-0 mt-1">
              Este nombre de usuario ya está ocupado
            </p>
          )}

          {!usernameError && usernameStatus === UsernameStatus.ERROR && (
            <p className="text-danger small mb-0 mt-1">
              No se pudo comprobar la disponibilidad
            </p>
          )}
        </div>

        <div className="onboarding field display-name">
          <label className="form-label" htmlFor="displayName">
            Nombre visible
          </label>

          <input
            id="displayName"
            className="form-control onboarding input"
            type="text"
            value={displayName}
            maxLength={DISPLAY_NAME_MAX}
            placeholder="Tu nombre visible"
            onChange={(event) => onDisplayNameChange(event.target.value)}
            onBlur={onDisplayNameBlur}
          />

          {displayNameError && (
            <p className="text-danger small mb-0 mt-1">{displayNameError}</p>
          )}
        </div>

        <div className="onboarding field bio">
          <label className="form-label" htmlFor="bio">
            Descripción
          </label>

          <textarea
            id="bio"
            className="form-control onboarding input"
            rows={3}
            value={bio}
            maxLength={BIO_MAX}
            placeholder="Cuéntanos un poco sobre ti"
            onChange={(event) => onBioChange(event.target.value)}
            onBlur={onBioBlur}
          />

          {bioError && (
            <p className="text-danger small mb-0 mt-1">{bioError}</p>
          )}
        </div>

        <div className="onboarding field visibility">
          <span className="form-label">Visibilidad</span>

          <div
            className="onboarding visibility options"
            role="radiogroup"
            aria-label="Visibilidad del perfil"
          >
            <button
              type="button"
              className={`onboarding visibility option${
                visibility === ProfileVisibility.PRIVATE ? " selected" : ""
              }`}
              role="radio"
              aria-checked={visibility === ProfileVisibility.PRIVATE}
              onClick={() => onVisibilityChange(ProfileVisibility.PRIVATE)}
            >
              <i className="bi bi-lock-fill" aria-hidden="true" />
              <span>Privado</span>
            </button>

            <button
              type="button"
              className={`onboarding visibility option${
                visibility === ProfileVisibility.PUBLIC ? " selected" : ""
              }`}
              role="radio"
              aria-checked={visibility === ProfileVisibility.PUBLIC}
              onClick={() => onVisibilityChange(ProfileVisibility.PUBLIC)}
            >
              <i className="bi bi-globe2" aria-hidden="true" />
              <span>Público</span>
            </button>
          </div>
        </div>
      </div>

      <div className="onboarding actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver
        </button>

        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Continuar
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
