import type { ManagedNews } from "../../domain/entities/managed.news";
import type { NewsDraftErrors } from "../validators/news.validator";

// estado de la tabla de noticias del admin
export type NewsManagementState = {
  news: ManagedNews[];
  search: string; // filtro por titulo o resumen
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;   // la que esta pidiendo confirmacion
  isDeleting: boolean;
  actionError: string | null;
  okMessage: string | null;
};

export const initialNewsManagementState: NewsManagementState = {
  news: [],
  search: "",
  isLoading: true,
  error: null,
  deletingId: null,
  isDeleting: false,
  actionError: null,
  okMessage: null,
};

// estado del formulario: editingId null = crear, con id = editar
export type NewsFormState = NewsDraftErrors & {
  isOpen: boolean;
  editingId: string | null;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  isSubmitting: boolean;
  formError: string | null;
};

export const initialNewsFormState: NewsFormState = {
  isOpen: false,
  editingId: null,
  title: "",
  summary: "",
  content: "",
  imageUrl: "",
  isSubmitting: false,
  titleError: null,
  summaryError: null,
  contentError: null,
  imageUrlError: null,
  formError: null,
};
