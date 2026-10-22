import type { ListItem } from "../../../domain/entities/list.item";
import type { MediaList } from "../../../domain/entities/media.list";
import type { AddContentState } from "../../models/lists.state";
import { SearchResultRow } from "../molecules/search.result.row";

type AddContentPanelProps = {
  list: MediaList;
  state: AddContentState;
  setQuery: (query: string) => void;
  add: (item: ListItem) => void;
  close: () => void;
};

export function AddContentPanel({
  list,
  state,
  setQuery,
  add,
  close,
}: AddContentPanelProps) {
  const hasQuery = state.query.trim().length >= 2;

  return (
    <section className="lists panel" aria-label="Agregar contenido">
      <div className="lists panel-top">
        <h2 className="lists panel-title">Agregar contenido</h2>
        <button type="button" className="btn btn-link" onClick={close}>
          Cerrar
        </button>
      </div>

      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search" />
        </span>
        <input
          className="form-control"
          type="search"
          placeholder="Busca una pelicula o serie"
          value={state.query}
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {state.addError && <p className="lists form-error">{state.addError}</p>}

      {/* mensajes segun lo que este pasando con la busqueda */}
      {!hasQuery && (
        <p className="lists panel-hint">Escribe al menos 2 letras para buscar.</p>
      )}
      {hasQuery && state.isSearching && (
        <p className="lists panel-hint">Buscando...</p>
      )}
      {hasQuery && !state.isSearching && state.searchError && (
        <p className="lists form-error">{state.searchError}</p>
      )}
      {hasQuery && !state.isSearching && !state.searchError && state.results.length === 0 && (
        <p className="lists panel-hint">No encontramos nada con ese nombre.</p>
      )}

      {state.results.length > 0 && (
        <ul className="lists results">
          {state.results.map((item) => (
            <SearchResultRow
              key={item.key}
              item={item}
              alreadyAdded={list.has(item.tmdbId, item.mediaType)}
              busy={state.addingKey === item.key}
              onAdd={add}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
