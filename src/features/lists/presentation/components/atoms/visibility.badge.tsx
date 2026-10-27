import { ListVisibility } from "../../../domain/entities/list.visibility";

type VisibilityBadgeProps = {
  visibility: ListVisibility;
};

export function VisibilityBadge({ visibility }: VisibilityBadgeProps) {
  const isPublic = visibility === ListVisibility.PUBLIC;

  return (
    <span className="lists badge">
      <i className={`bi bi-${isPublic ? "globe2" : "lock-fill"}`} aria-hidden="true" />
      {isPublic ? "Publica" : "Privada"}
    </span>
  );
}
