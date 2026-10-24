import { useEffect, type SubmitEventHandler } from "react";

import type { ContentSearchResult } from "../../../domain/entities/content.search.result";
import { SearchStatus } from "../../models/onboarding.state";

type FavoritesStepProps = {
  query: string;
  results: ContentSearchResult[];
  favorites: ContentSearchResult[];
  status: SearchStatus;
  corrected: boolean;
  executedQuery: string;
  isSubmitting: boolean;

  onQueryChange: (value: string) => void;
  onSearch: () => Promise<void>;
  isFavorite: (item: ContentSearchResult) => boolean;
  onToggleFavorite: (item: ContentSearchResult) => void;

  onBack: () => void;
  onFinish: () => void;
  onSkip: () => void;
};

export function FavoritesStep({
  query,
  results,
  favorites,
  status,
  corrected,
  executedQuery,
  isSubmitting,
  onQueryChange,
  onSearch,
  isFavorite,
  onToggleFavorite,
  onBack,
  onFinish,
  onSkip,
}: FavoritesStepProps) {
  useEffect(() => {
    // 1. esperar una consulta util
    if (query.trim().length < 2) {
      return;
    }

    // 2. buscar cuando el usuario deje de escribir
    const timeout = window.setTimeout(() => {
      void onSearch();
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const handleSearch: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await onSearch();
  };

  return (
    <section className="onboarding step favorites">
      <header className="onboarding section header">
        <span className="onboarding eyebrow">Tus gustos</span>
        <h1>Elige tus favoritos</h1>
        <p>Busca películas o series y selecciona hasta cinco.</p>

        <span className="onboarding counter">{favorites.length}/5 elegidos</span>
      </header>

      {favorites.length > 0 && (
        <div className="onboarding selected" aria-label="Favoritos seleccionados">
          {favorites.map((item) => (
            <button
              key={`${item.mediaType}-${item.tmdbId}`}
              type="button"
              className="onboarding selected item"
              onClick={() => onToggleFavorite(item)}
            >
              <span>{item.title}</span>
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <form className="onboarding search" onSubmit={handleSearch}>
        <div className="onboarding search control">
          <i className="bi bi-search" aria-hidden="true" />

          <input
            className="form-control onboarding input"
            type="search"
            value={query}
            placeholder="Buscar película o serie"
            aria-label="Buscar película o serie"
            onChange={(event) => onQueryChange(event.target.value)}
          />

          {status === SearchStatus.LOADING && (
            <span
              className="spinner-border spinner-border-sm onboarding search spinner"
              aria-label="Buscando"
            />
          )}
        </div>
      </form>

      {corrected && executedQuery && (
        <p className="onboarding search hint">
          Mostrando resultados para "{executedQuery}"
        </p>
      )}

      {status === SearchStatus.ERROR && (
        <p className="onboarding search message error">
          No se pudo realizar la búsqueda.
        </p>
      )}

      {status === SearchStatus.SUCCESS && results.length === 0 && (
        <p className="onboarding search message">
          No encontramos contenido para esa búsqueda.
        </p>
      )}

      <div className="onboarding results">
        {results.map((item) => {
          const selected = isFavorite(item);
          const full = favorites.length >= 5 && !selected;

          return (
            <button
              key={`${item.mediaType}-${item.tmdbId}`}
              type="button"
              className={`onboarding media option${selected ? " selected" : ""}`}
              disabled={full}
              aria-pressed={selected}
              onClick={() => onToggleFavorite(item)}
            >
              <span className="onboarding poster">
                {item.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                    alt=""
                  />
                ) : (
                  <i className="bi bi-film" aria-hidden="true" />
                )}

                <span className="onboarding media check" aria-hidden="true">
                  <i className={`bi ${selected ? "bi-check-lg" : "bi-plus-lg"}`} />
                </span>
              </span>

              <span className="onboarding media details">
                <strong>{item.title}</strong>
                <span>
                  {item.year ?? "Sin fecha"} · {item.mediaType === "movie" ? "Película" : "Serie"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="onboarding actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isSubmitting}
          onClick={onBack}
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          Volver
        </button>

        <div className="onboarding finish">
          <button
            type="button"
            className="btn btn-link"
            disabled={isSubmitting}
            onClick={onSkip}
          >
            Omitir
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={onFinish}
          >
            {isSubmitting ? "Guardando..." : "Completar perfil"}
            {!isSubmitting && (
              <i className="bi bi-arrow-right" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
