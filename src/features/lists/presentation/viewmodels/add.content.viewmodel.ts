import { useEffect, useState } from "react";

import { ListException } from "../../data/errors/list.exceptions";
import type { ListItem } from "../../domain/entities/list.item";
import type { MediaList } from "../../domain/entities/media.list";
import type { AddListItem } from "../../domain/usecases/add.list.item";
import type { SearchListContent } from "../../domain/usecases/search.list.content";
import type { AddContentState } from "../models/lists.state";

// espero un poquito despues de la ultima tecla antes de buscar
const SEARCH_DELAY_MS = 300;

type SearchResult = {
  query: string;
  results: ListItem[];
  error: string | null;
};

export function useAddContentViewModel(
  searchListContent: SearchListContent,
  addListItem: AddListItem,
  listId: string,
  onAdded: (list: MediaList) => void,
): {
  state: AddContentState;
  setQuery: (query: string) => void;
  add: (item: ListItem) => Promise<void>;
  clear: () => void;
} {
  const [query, setQueryValue] = useState("");

  // guardo para que consulta son los resultados, asi se si estoy "buscando"
  const [search, setSearch] = useState<SearchResult>({
    query: "",
    results: [],
    error: null,
  });

  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // con menos de 2 letras no busco nada
    if (trimmed.length < 2) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      searchListContent
        .call(trimmed)
        .then((results) => {
          if (cancelled) return;
          setSearch({ query: trimmed, results, error: null });
        })
        .catch((e: unknown) => {
          if (cancelled) return;

          const message =
            e instanceof ListException ? e.message : "No pudimos buscar";

          setSearch({ query: trimmed, results: [], error: message });
        });
    }, SEARCH_DELAY_MS);

    // si siguen escribiendo cancelo la busqueda anterior
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, searchListContent]);

  function setQuery(value: string): void {
    setQueryValue(value);
    setAddError(null);
  }

  function clear(): void {
    setQueryValue("");
    setSearch({ query: "", results: [], error: null });
    setAddError(null);
  }

  async function add(item: ListItem): Promise<void> {
    setAddingKey(item.key);
    setAddError(null);

    try {
      // el usecase me devuelve la lista ya con el item, se la paso a la pagina
      const list = await addListItem.call(listId, item);
      onAdded(list);
    } catch (e) {
      setAddError(
        e instanceof ListException ? e.message : "No pudimos agregar el contenido",
      );
    } finally {
      setAddingKey(null);
    }
  }

  const trimmed = query.trim();
  const isActive = trimmed.length >= 2;

  // estoy buscando si hay consulta valida y los resultados son de otra consulta
  const state: AddContentState = {
    query,
    results: isActive && search.query === trimmed ? search.results : [],
    isSearching: isActive && search.query !== trimmed,
    searchError: isActive && search.query === trimmed ? search.error : null,
    addingKey,
    addError,
  };

  return { state, setQuery, add, clear };
}
