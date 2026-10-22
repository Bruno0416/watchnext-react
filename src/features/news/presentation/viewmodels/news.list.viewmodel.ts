import { useEffect, useState } from "react";

import type { GetNews } from "../../domain/usecases/get.news";
import { NewsException } from "../../data/errors/news.exceptions";
import { initialNewsListState, type NewsListState } from "../models/news.state";

export function useNewsListViewModel(getNews: GetNews): {
  state: NewsListState;
  reload: () => void;
} {
  const [state, setState] = useState<NewsListState>(initialNewsListState);

  // con esto fuerzo la recarga cuando aprietan reintentar
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // si la pagina se desmonta antes de que llegue la respuesta, la ignoro
    let cancelled = false;

    // pido el listado al usecase
    getNews
      .call()
      .then((articles) => {
        if (cancelled) return;

        // guardo lo que llego, si viene vacio la vista muestra el estado vacio
        setState({ articles, isLoading: false, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;

        // dejo un mensaje que la vista pueda mostrar
        const message =
          e instanceof NewsException ? e.message : "Ocurrió un error inesperado";

        setState({ articles: [], isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [getNews, attempt]);

  function reload(): void {
    // vuelvo a cargando y disparo el efecto de nuevo
    setState(initialNewsListState);
    setAttempt((current) => current + 1);
  }

  return { state, reload };
}
