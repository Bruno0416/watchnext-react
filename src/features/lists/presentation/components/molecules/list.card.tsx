import { Link } from "react-router";

import type { ListSummary } from "../../../domain/entities/list.summary";
import { VisibilityBadge } from "../atoms/visibility.badge";

type ListCardProps = {
  list: ListSummary;
};

const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" });

export function ListCard({ list }: ListCardProps) {
  const count = list.itemCount;

  return (
    <article className="lists card">
      <Link className="lists card-link" to={`/listas/${list.id}`}>
        <div className="lists card-top">
          <h2 className="lists card-title">{list.name}</h2>
          <VisibilityBadge visibility={list.visibility} />
        </div>

        {list.description && (
          <p className="lists card-description">{list.description}</p>
        )}

        <p className="lists card-meta">
          <span>
            <i className="bi bi-collection-play" aria-hidden="true" />
            {count === 1 ? "1 titulo" : `${count} titulos`}
          </span>
          <span>Actualizada el {formatter.format(list.updatedAt)}</span>
        </p>
      </Link>
    </article>
  );
}
