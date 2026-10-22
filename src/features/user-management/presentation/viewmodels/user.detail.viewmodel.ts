import { useEffect, useState } from "react";

import {
  AdminUserNotFoundException,
  UserManagementException,
} from "../../data/errors/user.management.exceptions";
import type { GetUserDetail } from "../../domain/usecases/get.user.detail";
import { initialUserDetailState, type UserDetailState } from "../models/user.management.state";

type Loaded = UserDetailState & { loadedFor: string | null };

export function useUserDetailViewModel(getUserDetail: GetUserDetail, userId: string) {
  const [loaded, setLoaded] = useState<Loaded>({ ...initialUserDetailState, loadedFor: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getUserDetail
      .call(userId)
      .then((user) => {
        if (!cancelled) setLoaded({ ...initialUserDetailState, user, isLoading: false, loadedFor: userId });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof AdminUserNotFoundException) {
          setLoaded({ ...initialUserDetailState, isLoading: false, notFound: true, loadedFor: userId });
          return;
        }
        const msg = e instanceof UserManagementException ? e.message : "Ocurrio un error inesperado";
        setLoaded({ ...initialUserDetailState, isLoading: false, error: msg, loadedFor: userId });
      });
    return () => {
      cancelled = true;
    };
  }, [getUserDetail, userId, attempt]);

  function reload(): void {
    setLoaded({ ...initialUserDetailState, loadedFor: null });
    setAttempt((a) => a + 1);
  }

  const { loadedFor, ...rest } = loaded;
  const state: UserDetailState = loadedFor === userId ? rest : initialUserDetailState;

  return { state, reload };
}
