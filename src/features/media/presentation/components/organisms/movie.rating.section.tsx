import type { CSSProperties } from "react";
import { Link } from "react-router";
import { useGuestAccess } from "../../../../../core/router/protected.route";
import { container } from "../../../../../core/di/container";
import type { GetMyMovieRating } from "../../../domain/usecases/get.my.movie.rating";
import type { CreateMovieRating } from "../../../domain/usecases/create.movie.rating";
import type { DeleteMovieRating } from "../../../domain/usecases/delete.movie.rating";
import { useMovieRatingViewModel } from "../../viewmodels/movie.rating.viewmodel";

export function MovieRatingSection({ tmdbId }: { tmdbId: number }) {
  const isGuest = useGuestAccess();
  const getMyMovieRating = container.resolve<GetMyMovieRating>("getMyMovieRating");
  const createMovieRating = container.resolve<CreateMovieRating>("createMovieRating");
  const deleteMovieRating = container.resolve<DeleteMovieRating>("deleteMovieRating");
  const { state, setScore, save, remove } = useMovieRatingViewModel(
    tmdbId,
    isGuest,
    getMyMovieRating,
    createMovieRating,
    deleteMovieRating,
  );

  return (
    <section className="media-detail-section media-detail-my-rating" aria-labelledby="movie-rating-title">
      <h2 id="movie-rating-title">Tu valoración</h2>
      {isGuest ? (
        <p className="media-detail-muted">
          <Link to="/auth">Inicia sesión</Link> para valorar esta película.
        </p>
      ) : state.status === "loading" ? (
        <p className="media-detail-muted" role="status">Cargando tu valoración...</p>
      ) : state.status === "error" ? (
        <p role="alert">{state.error}</p>
      ) : state.rating ? (
        <div className="media-detail-my-rating-saved">
          <p className="media-detail-my-rating-score">
            <i className="bi bi-star" aria-hidden="true" />
            <strong>{state.rating.score} / 10</strong>
          </p>
          <button
            type="button"
            className="btn btn-outline-danger"
            disabled={state.pending}
            onClick={() => void remove()}
          >
            {state.pending ? "Eliminando..." : "Eliminar mi valoración"}
          </button>
        </div>
      ) : (
        <div className="media-detail-my-rating-form">
          <label htmlFor="movie-rating-slider">
            ¿Qué puntuación le das a esta película?
            <strong className="media-detail-my-rating-value">
              <i className="bi bi-star" aria-hidden="true" />
              {state.score} <span>/ 10</span>
            </strong>
          </label>
          <input
            id="movie-rating-slider"
            className="media-detail-my-rating-slider"
            type="range"
            min={1}
            max={10}
            step={1}
            value={state.score}
            style={{ "--rating-progress": `${((state.score - 1) / 9) * 100}%` } as CSSProperties}
            onChange={(event) => setScore(Number(event.target.value))}
            aria-valuetext={`${state.score} de 10`}
            disabled={state.pending}
          />
          <div className="media-detail-my-rating-labels" aria-hidden="true">
            <span>1</span>
            <span>10</span>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={state.pending}
            onClick={() => void save()}
          >
            {state.pending ? "Guardando..." : "Guardar valoración"}
          </button>
        </div>
      )}
      {!isGuest && state.status === "ready" && (
        <div className="media-detail-my-rating-feedback" aria-live="polite">
          {state.error && <p className="text-danger" role="alert">{state.error}</p>}
          {state.notice && <p className="media-detail-muted">{state.notice}</p>}
        </div>
      )}
    </section>
  );
}
