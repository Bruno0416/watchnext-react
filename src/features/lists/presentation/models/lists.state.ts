import type { ListItem } from "../../domain/entities/list.item";
import type { ListSummary } from "../../domain/entities/list.summary";
import { ListVisibility } from "../../domain/entities/list.visibility";
import type { MediaList } from "../../domain/entities/media.list";

// estado de "mis listas"
export type ListsState = {
  lists: ListSummary[];
  isLoading: boolean;
  error: string | null;
};

export const initialListsState: ListsState = {
  lists: [],
  isLoading: true,
  error: null,
};

// estado del formulario de nueva lista
export type CreateListState = {
  isOpen: boolean;
  name: string;
  description: string;
  visibility: ListVisibility;
  isSubmitting: boolean;

  // errores
  nameError: string | null;
  descriptionError: string | null;
  formError: string | null;
};

export const initialCreateListState: CreateListState = {
  isOpen: false,
  name: "",
  description: "",
  visibility: ListVisibility.PUBLIC,
  isSubmitting: false,
  nameError: null,
  descriptionError: null,
  formError: null,
};

// estado del detalle de una lista
export type ListDetailState = {
  list: MediaList | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;

  // key del item que se esta quitando, para desactivar su boton
  busyKey: string | null;
  isDeleting: boolean;
  actionError: string | null;
};

export const initialListDetailState: ListDetailState = {
  list: null,
  isLoading: true,
  notFound: false,
  error: null,
  busyKey: null,
  isDeleting: false,
  actionError: null,
};

// estado del buscador para agregar contenido
export type AddContentState = {
  query: string;
  results: ListItem[];
  isSearching: boolean;
  searchError: string | null;

  // key del item que se esta agregando
  addingKey: string | null;
  addError: string | null;
};
