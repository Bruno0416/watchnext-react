import { useEffect, useState } from "react";

import { ProfileException, ProfileNotFoundException } from "../../data/errors/profile.exceptions";
import { RelationshipStatus } from "../../domain/entities/relationship";
import type { GetFollowers } from "../../domain/usecases/get.followers";
import type { GetFollowing } from "../../domain/usecases/get.following";
import type { GetMyProfile } from "../../domain/usecases/get.my.profile";
import type { GetProfile } from "../../domain/usecases/get.profile";
import type { GetRelationship } from "../../domain/usecases/get.relationship";
import { type FollowListState, type FollowMode, initialFollowListState } from "../models/follow.state";

type Loaded = FollowListState & { loadedFor: string | null };

export function useFollowListViewModel(
  getProfile: GetProfile,
  getMyProfile: GetMyProfile,
  getRelationship: GetRelationship,
  getFollowers: GetFollowers,
  getFollowing: GetFollowing,
  username: string,
  mode: FollowMode,
) {
  const clave = `${mode}:${username}`;
  const [loaded, setLoaded] = useState<Loaded>({ ...initialFollowListState, loadedFor: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function cargar(): Promise<FollowListState> {
      // 1. el dueño de la lista
      const perfil = await getProfile.call(username);
      const owner = perfil.shownName;

      // 2. si es privado y no es mio ni lo sigo, no muestro la lista
      if (perfil.isPrivate) {
        const mio = await getMyProfile.call().catch(() => null);
        const esMio = mio?.username === perfil.username;
        const rel = esMio ? null : await getRelationship.call(username).catch(() => null);
        if (!esMio && rel?.status !== RelationshipStatus.FOLLOWING) {
          return { ...initialFollowListState, owner, hidden: true, isLoading: false };
        }
      }

      // 3. la lista que corresponde
      const people = mode === "followers" ? await getFollowers.call(username) : await getFollowing.call(username);
      return { ...initialFollowListState, owner, people, isLoading: false };
    }

    cargar()
      .then((s) => {
        if (!cancelled) setLoaded({ ...s, loadedFor: clave });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof ProfileNotFoundException) {
          setLoaded({ ...initialFollowListState, isLoading: false, notFound: true, loadedFor: clave });
          return;
        }
        const msg = e instanceof ProfileException ? e.message : "Ocurrio un error inesperado";
        setLoaded({ ...initialFollowListState, isLoading: false, error: msg, loadedFor: clave });
      });

    return () => {
      cancelled = true;
    };
  }, [getProfile, getMyProfile, getRelationship, getFollowers, getFollowing, username, mode, clave, attempt]);

  function reload(): void {
    setLoaded({ ...initialFollowListState, loadedFor: null });
    setAttempt((a) => a + 1);
  }

  const { loadedFor, ...rest } = loaded;
  const state: FollowListState = loadedFor === clave ? rest : initialFollowListState;

  return { state, reload };
}
