import { useEffect, useState } from "react";

import type { GetNewsArticle } from "../../domain/usecases/get.news.article";
import {
  NewsException,
  NewsNotFoundException,
} from "../../data/errors/news.exceptions";
import {
  initialNewsDetailState,
  type NewsDetailState,
} from "../models/news.state";

// guardo de que id es lo cargado para saber si corresponde a la url actual
type LoadedState = NewsDetailState & { loadedId: string | null };

const notFoundState: NewsDetailState = {
  article: null,
  isLoading: false,
  notFound: true,
  error: null,
};

export function useNewsDetailViewModel(
  getNewsArticle: GetNewsArticle,
  id: string | undefined,
): { state: NewsDetailState } {
  const [loaded, setLoaded] = useState<LoadedState>({
    ...initialNewsDetailState,
    loadedId: null,
  });

  // cada vez que cambia el id de la url vuelvo a cargar
  useEffect(() => {
    // sin id no hay nada que buscar
    if (!id) return;

    // si cambian de noticia antes de que llegue la respuesta, la ignoro
    let cancelled = false;

    // pido la noticia al usecase
    getNewsArticle
      .call(id)
      .then((article) => {
        if (cancelled) return;

        setLoaded({
          article,
          isLoading: false,
          notFound: false,
          error: null,
          loadedId: id,
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;

        // separo "no existe" del resto de errores
        if (e instanceof NewsNotFoundException) {
          setLoaded({ ...notFoundState, loadedId: id });
          return;
        }

        const message =
          e instanceof NewsException ? e.message : "Ocurrió un error inesperado";

        setLoaded({
          article: null,
          isLoading: false,
          notFound: false,
          error: message,
          loadedId: id,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [getNewsArticle, id]);

  // sin id es "no encontrada", y si lo cargado no es de este id sigo en cargando
  if (!id) {
    return { state: notFoundState };
  }

  if (loaded.loadedId !== id) {
    return { state: initialNewsDetailState };
  }

  const { loadedId: _loadedId, ...state } = loaded;
  return { state };
}
