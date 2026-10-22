import type { FormEvent } from "react";

import type { NewsFormState } from "../../models/news.management.state";
import { CONTENT_MAX, SUMMARY_MAX, TITLE_MAX } from "../../validators/news.validator";
import { NewsFormField } from "../molecules/news.form.field";

type Campo = "title" | "summary" | "content" | "imageUrl";

type NewsFormProps = {
  form: NewsFormState;
  onField: (campo: Campo, valor: string) => void;
  onBlur: (campo: Campo) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

// el mismo formulario para crear y para editar
export function NewsForm({ form, onField, onBlur, onSubmit, onCancel }: NewsFormProps) {
  const editando = form.editingId !== null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className="nm form" onSubmit={handleSubmit} noValidate aria-label={editando ? "Editar noticia" : "Nueva noticia"}>
      <h2 className="nm form-title">{editando ? "Editar noticia" : "Nueva noticia"}</h2>

      <NewsFormField
        id="nm-title"
        label="Titulo"
        value={form.title}
        error={form.titleError}
        max={TITLE_MAX}
        onChange={(v) => onField("title", v)}
        onBlur={() => onBlur("title")}
      />
      <NewsFormField
        id="nm-summary"
        label="Resumen"
        value={form.summary}
        error={form.summaryError}
        max={SUMMARY_MAX}
        multiline
        rows={2}
        onChange={(v) => onField("summary", v)}
        onBlur={() => onBlur("summary")}
      />
      <NewsFormField
        id="nm-content"
        label="Contenido"
        value={form.content}
        error={form.contentError}
        max={CONTENT_MAX}
        multiline
        rows={8}
        onChange={(v) => onField("content", v)}
        onBlur={() => onBlur("content")}
      />
      <NewsFormField
        id="nm-image"
        label="Url de la imagen"
        value={form.imageUrl}
        error={form.imageUrlError}
        placeholder="https://..."
        optional
        onChange={(v) => onField("imageUrl", v)}
        onBlur={() => onBlur("imageUrl")}
      />

      {form.formError && (
        <div className="alert alert-danger" role="alert">
          {form.formError}
        </div>
      )}

      <div className="nm form-actions">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={form.isSubmitting}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Guardando..." : editando ? "Guardar cambios" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
