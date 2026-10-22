import { useEffect, useState } from "react";

import { ProfileException } from "../../data/errors/profile.exceptions";
import { RelationshipStatus } from "../../domain/entities/relationship";
import type { FollowUser } from "../../domain/usecases/follow.user";
import type { GetRelationship } from "../../domain/usecases/get.relationship";
import type { UnfollowUser } from "../../domain/usecases/unfollow.user";
import { initialRelationshipState, type RelationshipState } from "../models/follow.state";

type Loaded = RelationshipState & { loadedFor: string | null };

/**
 * username null = no muestro boton (es mi perfil o todavia no carga).
 * onChange avisa al perfil para que refresque los contadores.
 */
export function useRelationshipViewModel(
  getRelationship: GetRelationship,
  followUser: FollowUser,
  unfollowUser: UnfollowUser,
  username: string | null,
  onChange: () => void,
) {
  const [loaded, setLoaded] = useState<Loaded>({ ...initialRelationshipState, loadedFor: null });

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    getRelationship
      .call(username)
      .then((relationship) => {
        if (!cancelled) setLoaded({ ...initialRelationshipState, relationship, canFollow: true, isLoading: false, loadedFor: username });
      })
      .catch(() => {
        // sin sesion: no muestro el boton
        if (!cancelled) setLoaded({ ...initialRelationshipState, canFollow: false, isLoading: false, loadedFor: username });
      });
    return () => {
      cancelled = true;
    };
  }, [getRelationship, username]);

  // seguir, o dejar de seguir / cancelar solicitud si ya habia algo
  async function toggle(): Promise<void> {
    if (!username) return;
    const actual = loaded.relationship.status;
    setLoaded((c) => ({ ...c, isBusy: true, error: null }));
    try {
      let status = RelationshipStatus.NONE;
      if (actual === RelationshipStatus.NONE) status = await followUser.call(username);
      else await unfollowUser.call(username);
      setLoaded((c) => ({ ...c, isBusy: false, relationship: { ...c.relationship, status } }));
      onChange();
    } catch (e) {
      const msg = e instanceof ProfileException ? e.message : "Ocurrio un error inesperado";
      setLoaded((c) => ({ ...c, isBusy: false, error: msg }));
    }
  }

  const { loadedFor, ...rest } = loaded;
  const state: RelationshipState = username && loadedFor === username ? rest : initialRelationshipState;

  return { state, toggle };
}
