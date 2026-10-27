import { useEffect, useState } from "react";

import { ListException } from "../../data/errors/list.exceptions";
import { ListSummary } from "../../domain/entities/list.summary";
import type { ListVisibility } from "../../domain/entities/list.visibility";
import type { MediaList } from "../../domain/entities/media.list";
import type { CreateList } from "../../domain/usecases/create.list";
import type { GetLists } from "../../domain/usecases/get.lists";
import {
  type CreateListState,
  initialCreateListState,
  initialListsState,
  type ListsState,
} from "../models/lists.state";
import {
  validateCreateList,
  validateListDescription,
  validateListName,
} from "../validators/list.validator";

// de la lista completa que devuelve crear saco el resumen para la grilla
function toSummary(list: MediaList): ListSummary {
  return new ListSummary({
    id: list.id,
    userId: list.userId,
    name: list.name,
    description: list.description,
    visibility: list.visibility,
    itemCount: list.items.length,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  });
}

function messageOf(e: unknown): string {
  return e instanceof ListException ? e.message : "Ocurrio un error inesperado";
}

export function useListsViewModel(
  getLists: GetLists,
  createList: CreateList,
): {
  state: ListsState;
  form: CreateListState;
  reload: () => void;
  toggleForm: () => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (visibility: ListVisibility) => void;
  validateNameField: () => void;
  validateDescriptionField: () => void;
  submit: () => Promise<boolean>;
} {
  const [state, setState] = useState<ListsState>(initialListsState);
  const [form, setForm] = useState<CreateListState>(initialCreateListState);

  // con esto fuerzo la recarga cuando aprietan reintentar
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // si la pagina se desmonta antes de que llegue la respuesta, la ignoro
    let cancelled = false;

    getLists
      .call()
      .then((lists) => {
        if (cancelled) return;
        setState({ lists, isLoading: false, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({ lists: [], isLoading: false, error: messageOf(e) });
      });

    return () => {
      cancelled = true;
    };
  }, [getLists, attempt]);

  function reload(): void {
    setState(initialListsState);
    setAttempt((current) => current + 1);
  }

  // ---------- formulario ----------
  function toggleForm(): void {
    // al cerrar limpio todo, al abrir parto de cero
    setForm((current) => ({ ...initialCreateListState, isOpen: !current.isOpen }));
  }

  function setName(name: string): void {
    setForm((current) => ({ ...current, name, nameError: null, formError: null }));
  }

  function setDescription(description: string): void {
    setForm((current) => ({
      ...current,
      description,
      descriptionError: null,
      formError: null,
    }));
  }

  function setVisibility(visibility: ListVisibility): void {
    setForm((current) => ({ ...current, visibility, formError: null }));
  }

  function validateNameField(): void {
    setForm((current) => ({ ...current, nameError: validateListName(current.name) }));
  }

  function validateDescriptionField(): void {
    setForm((current) => ({
      ...current,
      descriptionError: validateListDescription(current.description),
    }));
  }

  async function submit(): Promise<boolean> {
    // valido todo junto antes de llamar al usecase
    const errors = validateCreateList(form.name, form.description);

    if (errors.nameError || errors.descriptionError) {
      setForm((current) => ({ ...current, ...errors }));
      return false;
    }

    setForm((current) => ({ ...current, isSubmitting: true }));

    try {
      const created = await createList.call({
        name: form.name,
        description: form.description,
        visibility: form.visibility,
      });

      // la meto al principio sin volver a pedir todo
      setState((current) => ({
        ...current,
        lists: [toSummary(created), ...current.lists],
      }));
      setForm(initialCreateListState);

      return true;
    } catch (e) {
      setForm((current) => ({
        ...current,
        isSubmitting: false,
        formError: messageOf(e),
      }));

      return false;
    }
  }

  return {
    state,
    form,
    reload,
    toggleForm,
    setName,
    setDescription,
    setVisibility,
    validateNameField,
    validateDescriptionField,
    submit,
  };
}
