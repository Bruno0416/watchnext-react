import type { SubmitEventHandler } from "react";

import { ProfileVisibility } from "../../../../../core/models/profile.visibility";
import type { EditProfileState } from "../../models/profile.state";
import { COUNTRY_OPTIONS } from "../../../../../core/models/supported.countries";
import { BIO_MAX, DISPLAY_NAME_MAX } from "../../validators/profile.validator";

type EditProfileFormProps = {
  form: EditProfileState;
  username: string;
  setDisplayName: (v: string) => void;
  setBio: (v: string) => void;
  setCountry: (v: string) => void;
  setVisibility: (v: ProfileVisibility) => void;
  validateDisplayNameField: () => void;
  validateBioField: () => void;
  validateCountryField: () => void;
  submit: () => Promise<boolean>;
  cancel: () => void;
};

export function EditProfileForm({
  form,
  username,
  setDisplayName,
  setBio,
  setCountry,
  setVisibility,
  validateDisplayNameField,
  validateBioField,
  validateCountryField,
  submit,
  cancel,
}: EditProfileFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="profile form" onSubmit={handleSubmit} noValidate>
      <h2 className="profile form-title">Editar perfil</h2>

      {/* el username no se edita aca: lo fija el onboarding */}
      <div className="profile form-field">
        <label className="form-label" htmlFor="profile-username">
          Usuario
        </label>
        <div className="input-group">
          <span className="input-group-text">@</span>
          <input id="profile-username" className="form-control" type="text" value={username} disabled />
        </div>
      </div>

      <div className="profile form-field">
        <label className="form-label" htmlFor="profile-display-name">
          Nombre para mostrar
        </label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-person-fill" />
          </span>
          <input
            id="profile-display-name"
            className="form-control"
            type="text"
            maxLength={DISPLAY_NAME_MAX}
            placeholder="Como quieres que te vean"
            value={form.displayName}
            disabled={form.isSubmitting}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={validateDisplayNameField}
          />
        </div>
        {form.displayNameError && <p className="text-danger small mb-0 mt-1">{form.displayNameError}</p>}
      </div>

      <div className="profile form-field">
        <label className="form-label" htmlFor="profile-bio">
          Descripcion
        </label>
        <div className="input-group">
          <textarea
            id="profile-bio"
            className="form-control"
            rows={3}
            maxLength={BIO_MAX}
            placeholder="Que te gusta ver"
            value={form.bio}
            disabled={form.isSubmitting}
            onChange={(e) => setBio(e.target.value)}
            onBlur={validateBioField}
          />
        </div>
        <p className="profile form-hint">
          {form.bio.length}/{BIO_MAX}
        </p>
        {form.bioError && <p className="text-danger small mb-0 mt-1">{form.bioError}</p>}
      </div>

      <div className="profile form-row">
        <div className="profile form-field">
          <label className="form-label" htmlFor="profile-country">
            País de disponibilidad
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-geo-alt-fill" aria-hidden="true" />
            </span>
            <select
              id="profile-country"
              className="form-select form-control"
              value={form.country}
              disabled={form.isSubmitting}
              onChange={(e) => setCountry(e.target.value)}
              onBlur={validateCountryField}
            >
              {!COUNTRY_OPTIONS.some((p) => p.code === form.country) && (
                <option value={form.country} disabled>
                  País anterior no disponible; elige uno de los tres países
                </option>
              )}
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>
          <p className="profile form-hint">Solo se usa para consultar disponibilidad de contenido; no se muestra en tu perfil.</p>
          {form.countryError && <p className="text-danger small mb-0 mt-1">{form.countryError}</p>}
        </div>

        <div className="profile form-field">
          <label className="form-label" htmlFor="profile-visibility">
            Visibilidad
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-eye-fill" />
            </span>
            <select
              id="profile-visibility"
              className="form-select form-control"
              value={form.visibility}
              disabled={form.isSubmitting}
              onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
            >
              <option value={ProfileVisibility.PUBLIC}>Publico, cualquiera me ve</option>
              <option value={ProfileVisibility.PRIVATE}>Privado, solo quien me siga</option>
            </select>
          </div>
        </div>
      </div>

      {form.formError && <p className="profile form-error">{form.formError}</p>}

      <div className="profile form-actions">
        <button type="button" className="btn btn-secondary" disabled={form.isSubmitting} onClick={cancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
