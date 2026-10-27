import { RelationshipStatus } from "../../../domain/entities/relationship";
import type { RelationshipState } from "../../models/follow.state";

type FollowButtonProps = {
  state: RelationshipState;
  onToggle: () => void;
};

const textos = {
  [RelationshipStatus.NONE]: { label: "Seguir", icon: "person-plus-fill", clase: "btn-primary" },
  [RelationshipStatus.REQUESTED]: { label: "Solicitud enviada", icon: "hourglass-split", clase: "btn-outline-secondary" },
  [RelationshipStatus.FOLLOWING]: { label: "Siguiendo", icon: "person-check-fill", clase: "btn-outline-primary" },
};

// boton seguir / siguiendo / solicitud enviada, mas el aviso de "te sigue"
export function FollowButton({ state, onToggle }: FollowButtonProps) {
  if (state.isLoading || !state.canFollow) return null;
  const t = textos[state.relationship.status];

  return (
    <div className="profile follow">
      <button
        type="button"
        className={`btn ${t.clase}`}
        onClick={onToggle}
        disabled={state.isBusy}
        aria-pressed={state.relationship.status !== RelationshipStatus.NONE}
      >
        <i className={`bi bi-${t.icon}`} aria-hidden="true" /> {t.label}
      </button>
      {state.relationship.followsYou && <span className="profile follows-you">Te sigue</span>}
      {state.error && <p className="profile form-error">{state.error}</p>}
    </div>
  );
}
