import type { ProfileSummary } from "../../domain/entities/profile.summary";
import { type Relationship, RelationshipStatus } from "../../domain/entities/relationship";

// boton de seguir en el perfil de otro
export type RelationshipState = {
  relationship: Relationship;
  canFollow: boolean; // false si no hay sesion
  isLoading: boolean;
  isBusy: boolean;
  error: string | null;
};

export const initialRelationshipState: RelationshipState = {
  relationship: { status: RelationshipStatus.NONE, followsYou: false },
  canFollow: false,
  isLoading: true,
  isBusy: false,
  error: null,
};

export type FollowMode = "followers" | "following";

// pagina de seguidores o seguidos
export type FollowListState = {
  owner: string | null; // nombre a mostrar del dueño de la lista
  people: ProfileSummary[];
  hidden: boolean; // perfil privado que no sigo
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
};

export const initialFollowListState: FollowListState = {
  owner: null,
  people: [],
  hidden: false,
  isLoading: true,
  notFound: false,
  error: null,
};

// pagina de solicitudes que me llegaron
export type FollowRequestsState = {
  requests: ProfileSummary[];
  isLoading: boolean;
  busyUsername: string | null;
  error: string | null;
  actionError: string | null;
};

export const initialFollowRequestsState: FollowRequestsState = {
  requests: [],
  isLoading: true,
  busyUsername: null,
  error: null,
  actionError: null,
};
