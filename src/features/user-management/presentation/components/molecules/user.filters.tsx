import type { RoleFilter } from "../../models/user.management.state";

type UserFiltersProps = {
  query: string;
  role: RoleFilter;
  total: number;
  onQuery: (v: string) => void;
  onRole: (v: RoleFilter) => void;
};

// buscador por correo, username o nombre + filtro de rol
export function UserFilters({ query, role, total, onQuery, onRole }: UserFiltersProps) {
  return (
    <div className="um filters">
      <div className="input-group um filters-search">
        <span className="input-group-text">
          <i className="bi bi-search" aria-hidden="true" />
        </span>
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por correo, usuario o nombre"
          aria-label="Buscar usuarios"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <select
        className="form-select um filters-role"
        aria-label="Filtrar por rol"
        value={role}
        onChange={(e) => onRole(e.target.value as RoleFilter)}
      >
        <option value="ALL">Todos los roles</option>
        <option value="ADMIN">Solo admin</option>
        <option value="USER">Solo usuarios</option>
      </select>
      <span className="um filters-count">{total} usuarios</span>
    </div>
  );
}
