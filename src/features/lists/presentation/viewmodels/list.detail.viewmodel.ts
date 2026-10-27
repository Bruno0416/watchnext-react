import { useEffect, useState } from "react";

import {
  ListException,
  ListNotFoundException,
} from "../../data/errors/list.exceptions";
import type { ListItem } from "../../domain/entities/list.item";
import type { MediaList } from "../../domain/entities/media.list";
import type { DeleteList } from "../../domain/usecases/delete.list";
import type { GetList } from "../../domain/usecases/get.list";
import type { RemoveListItem } from "../../domain/usecases/remove.list.item";
import {
  initialListDetailState,
  type ListDetailState,
} from "../models/lists.state";

// guardo de que id es lo cargado para saber si corresponde a la url actual
type LoadedState = ListDetailState & { loadedId: string | null };

const notFoundState: ListDetailState = {
  ...initialListDetailState,
  isLoading: false,
  notFound: true,
};

function messageOf(e: unknown): string {
  return e instanceof ListException ? e.message : "Ocurrio un error inesperado";
}

export function useListDetailViewModel(
  getList: GetList,
  deleteList: DeleteList,
  removeListItem: RemoveListItem,
  id: string | undefined,
): {
  state: ListDetailState;
  removeItem: (item: ListItem) => Promise<void>;
  remove: () => Promise<boolean>;
  applyList: (list: MediaList) => void;
} {
  const [loaded, setLoaded] = useState<LoadedState>({
    ...initialListDetailState,
    loadedId: null,
  });

  // cada vez que cambia el id de la url vuelvo a cargar
  useEffect(() => {
    if (!id) return;

    // si cambian de lista antes de que llegue la respuesta, la ignoro
    let cancelled = false;

    getList
      .call(id)
      .then((list) => {
        if (cancelled) return;
        setLoaded({ ...initialListDetailState, list, isLoading: false, loadedId: id });
      })
      .catch((e: unknown) => {
        if (cancelled) return;

        if (e instanceof ListNotFoundException) {
          setLoaded({ ...notFoundState, loadedId: id });
          return;
        }

        setLoaded({
          ...initialListDetailState,
          isLoading: false,
          error: messageOf(e),
          loadedId: id,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [getList, id]);

  // cuando el panel de agregar devuelve la lista actualizada la pongo aca
  function applyList(list: MediaList): void {
    setLoaded((current) => ({ ...current, list, actionError: null }));
  }

  async function removeItem(item: ListItem): Promise<void> {
    if (!id) return;

    setLoaded((current) => ({ ...current, busyKey: item.key, actionError: null }));

    try {
      const list = await removeListItem.call(id, item.tmdbId, item.mediaType);
      setLoaded((current) => ({ ...current, list, busyKey: null }));
    } catch (e) {
      setLoaded((current) => ({
        ...current,
        busyKey: null,
        actionError: messageOf(e),
      }));
    }
  }

  async function remove(): Promise<boolean> {
    if (!id) return false;

    setLoaded((current) => ({ ...current, isDeleting: true, actionError: null }));

    try {
      await deleteList.call(id);
      return true;
    } catch (e) {
      setLoaded((current) => ({
        ...current,
        isDeleting: false,
        actionError: messageOf(e),
      }));

      return false;
    }
  }

  // sin id es "no encontrada", y si lo cargado no es de este id sigo en cargando
  let state: ListDetailState;

  if (!id) {
    state = notFoundState;
  } else if (loaded.loadedId !== id) {
    state = initialListDetailState;
  } else {
    const { loadedId: _loadedId, ...rest } = loaded;
    state = rest;
  }

  return { state, removeItem, remove, applyList };
}
