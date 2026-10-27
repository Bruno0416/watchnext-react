import type { NewsDraft } from "../../domain/entities/managed.news";

export const TITLE_MIN = 5;
export const TITLE_MAX = 90;
export const SUMMARY_MIN = 10;
export const SUMMARY_MAX = 180;
export const CONTENT_MIN = 30;
export const CONTENT_MAX = 4000;

export function validateTitle(v: string): string | null {
  const t = v.trim();
  if (!t) return "El titulo es obligatorio";
  if (t.length < TITLE_MIN) return `Minimo ${TITLE_MIN} caracteres`;
  if (t.length > TITLE_MAX) return `Maximo ${TITLE_MAX} caracteres`;
  return null;
}

export function validateSummary(v: string): string | null {
  const t = v.trim();
  if (!t) return "El resumen es obligatorio";
  if (t.length < SUMMARY_MIN) return `Minimo ${SUMMARY_MIN} caracteres`;
  if (t.length > SUMMARY_MAX) return `Maximo ${SUMMARY_MAX} caracteres`;
  return null;
}

export function validateContent(v: string): string | null {
  const t = v.trim();
  if (!t) return "El contenido es obligatorio";
  if (t.length < CONTENT_MIN) return `Minimo ${CONTENT_MIN} caracteres`;
  if (t.length > CONTENT_MAX) return `Maximo ${CONTENT_MAX} caracteres`;
  return null;
}

// la imagen es opcional, pero si viene tiene que ser una url http(s)
export function validateImageUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "La imagen debe ser una url http o https";
    return null;
  } catch {
    return "Eso no parece una url valida";
  }
}

export type NewsDraftErrors = {
  titleError: string | null;
  summaryError: string | null;
  contentError: string | null;
  imageUrlError: string | null;
};

export function validateNewsDraft(d: NewsDraft): NewsDraftErrors {
  return {
    titleError: validateTitle(d.title),
    summaryError: validateSummary(d.summary),
    contentError: validateContent(d.content),
    imageUrlError: validateImageUrl(d.imageUrl),
  };
}

export function hayErrores(e: NewsDraftErrors): boolean {
  return Object.values(e).some((x) => x !== null);
}
