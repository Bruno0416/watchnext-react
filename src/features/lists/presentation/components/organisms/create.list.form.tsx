import type { SubmitEventHandler } from "react";

import { ListVisibility } from "../../../domain/entities/list.visibility";
import type { CreateListState } from "../../models/lists.state";
import {
  LIST_DESCRIPTION_MAX,
  LIST_NAME_MAX,
} from "../../validators/list.validator";

type CreateListFormProps = {
  form: CreateListState;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (visibility: ListVisibility) => void;
  validateNameField: () => void;
  validateDescriptionField: () => void;
  submit: () => Promise<boolean>;
  cancel: () => void;
};

export function CreateListForm({
  form,
  setName,
  setDescription,
  setVisibility,
  validateNameField,
  validateDescriptionField,
  submit,
  cancel,
}: CreateListFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="lists form" onSubmit={handleSubmit} noValidate>
      <h2 className="lists form-title">Nueva lista</h2>

      <div className="lists form-field">
        <label className="form-label" htmlFor="list-name">
          Nombre
        </label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-bookmark-fill" />
          </span>
          <input
            id="list-name"
            className="form-control"
            type="text"
            maxLength={LIST_NAME_MAX}
            placeholder="Ej: Para ver el finde"
            value={form.name}
            disabled={form.isSubmitting}
            onChange={(event) => setName(event.target.value)}
            onBlur={validateNameField}
          />
        </div>
        {form.nameError && <p className="text-danger small mb-0 mt-1">{form.nameError}</p>}
      </div>

      <div className="lists form-field">
        <label className="form-label" htmlFor="list-description">
          Descripcion <span className="lists form-optional">(opcional)</span>
        </label>
        <div className="input-group">
          <textarea
            id="list-description"
            className="form-control"
            rows={2}
            maxLength={LIST_DESCRIPTION_MAX}
            placeholder="De que va esta lista"
            value={form.description}
            disabled={form.isSubmitting}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={validateDescriptionField}
          />
        </div>
        {form.descriptionError && (
          <p className="text-danger small mb-0 mt-1">{form.descriptionError}</p>
        )}
      </div>

      <div className="lists form-field">
        <label className="form-label" htmlFor="list-visibility">
          Visibilidad
        </label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-eye-fill" />
          </span>
          <select
            id="list-visibility"
            className="form-select form-control"
            value={form.visibility}
            disabled={form.isSubmitting}
            onChange={(event) => setVisibility(event.target.value as ListVisibility)}
          >
            <option value={ListVisibility.PUBLIC}>Publica, cualquiera la puede ver</option>
            <option value={ListVisibility.PRIVATE}>Privada, solo yo</option>
          </select>
        </div>
      </div>

      {form.formError && <p className="lists form-error">{form.formError}</p>}

      <div className="lists form-actions">
        <button type="button" className="btn btn-secondary" disabled={form.isSubmitting} onClick={cancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Creando..." : "Crear lista"}
        </button>
      </div>
    </form>
  );
}
