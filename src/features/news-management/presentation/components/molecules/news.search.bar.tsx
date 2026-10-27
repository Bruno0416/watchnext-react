type NewsSearchBarProps = {
  value: string;
  total: number;
  visibles: number;
  onChange: (v: string) => void;
};

// buscador de la tabla; filtra al tiro mientras escribes
export function NewsSearchBar({ value, total, visibles, onChange }: NewsSearchBarProps) {
  return (
    <div className="nm search">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search" aria-hidden="true" />
        </span>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por titulo o resumen"
          aria-label="Buscar noticias"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <span className="nm search-count">
        {visibles === total ? `${total} noticias` : `${visibles} de ${total}`}
      </span>
    </div>
  );
}
