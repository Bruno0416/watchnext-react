import { useEffect, useState } from "react";
import { MediaType } from "../../../../core/models/media.type";
import { MediaNotFoundError } from "../../data/errors/media.errors";
import type { GetMediaDetail } from "../../domain/usecases/get.media.detail";
import type { MediaState } from "../models/media.state";

function parseRoute(
  typeParam: string | undefined,
  idParam: string | undefined,
) {
  const mediaType =
    typeParam === MediaType.MOVIE
      ? MediaType.MOVIE
      : typeParam === MediaType.TV
        ? MediaType.TV
        : null;
  const tmdbId = Number(idParam);
  return mediaType && Number.isSafeInteger(tmdbId) && tmdbId > 0
    ? { mediaType, tmdbId }
    : null;
}

export function useMediaViewModel(
  typeParam: string | undefined,
  idParam: string | undefined,
  getMediaDetail: GetMediaDetail,
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<MediaState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    const params = parseRoute(typeParam, idParam);

    // 1. evitar consultas cuando la ruta no tiene tipo o id valido
    if (!params) {
      setState({ status: "invalid" });
      return;
    }

    // 2. reiniciar el estado y obtener detalle
    setState({ status: "loading" });
    getMediaDetail
      .call(params.mediaType, params.tmdbId)
      .then((detail) => {
        if (active) setState({ status: "ready", detail });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState(
          error instanceof MediaNotFoundError
            ? { status: "notFound" }
            : {
                status: "error",
                message:
                  error instanceof Error ? error.message : "Error al cargar",
              },
        );
      });

    // 3. ignorar las respuestas atrasadas al cambiar de contenido
    return () => {
      active = false;
    };
  }, [typeParam, idParam, attempt, getMediaDetail]);

  return { state, reload: () => setAttempt((value) => value + 1) };
}
