import { useEffect, useState } from "react";
import type { CreateMovieRating } from "../../domain/usecases/create.movie.rating";
import type { DeleteMovieRating } from "../../domain/usecases/delete.movie.rating";
import type { GetMyMovieRating } from "../../domain/usecases/get.my.movie.rating";
import {
  initialMovieRatingState,
  type MovieRatingState,
} from "../models/movie.rating.state";

function getMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operación. Inténtalo de nuevo.";
}

export function useMovieRatingViewModel(
  tmdbId: number,
  isGuest: boolean,
  getMyMovieRating: GetMyMovieRating,
  createMovieRating: CreateMovieRating,
  deleteMovieRating: DeleteMovieRating,
) {
  const [state, setState] = useState<MovieRatingState>(initialMovieRatingState);

  // ---------- cargar valoracion propia ----------
  useEffect(() => {
    if (isGuest) return;
    let active = true;

    getMyMovieRating
      .call(tmdbId)
      .then((rating) => {
        if (active) {
          setState({
            ...initialMovieRatingState,
            status: "ready",
            rating,
            score: rating?.score ?? 5,
          });
        }
      })
      .catch((error: unknown) => {
        if (active)
          setState({
            ...initialMovieRatingState,
            status: "error",
            error: getMessage(error),
          });
      });

    return () => {
      active = false;
    };
  }, [tmdbId, isGuest, getMyMovieRating]);

  function setScore(score: number): void {
    setState((current) => ({ ...current, score, error: null, notice: null }));
  }

  async function save(): Promise<void> {
    if (state.pending || state.status !== "ready" || state.rating) return;

    // 1. bloquear controles mientras se guarda
    setState((current) => ({
      ...current,
      pending: true,
      error: null,
      notice: null,
    }));
    try {
      // 2. crear y reflejar la valoracion confirmada
      const rating = await createMovieRating.call(tmdbId, state.score);
      setState((current) => ({
        ...current,
        rating,
        score: rating.score,
        pending: false,
        notice: "Valoración guardada.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        pending: false,
        error: getMessage(error),
      }));
    }
  }

  async function remove(): Promise<void> {
    if (state.pending || state.status !== "ready" || !state.rating) return;

    // 1. bloquear controles mientras se elimina
    setState((current) => ({
      ...current,
      pending: true,
      error: null,
      notice: null,
    }));
    try {
      // 2. actualizar vista solo tras confirmar la eliminacion
      await deleteMovieRating.call(state.rating.id);
      setState((current) => ({
        ...current,
        rating: null,
        score: 5,
        pending: false,
        notice: "Valoración eliminada.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        pending: false,
        error: getMessage(error),
      }));
    }
  }

  return { state, setScore, save, remove };
}
