import { useEffect, useState } from "react";

import { ProfileException } from "../../data/errors/profile.exceptions";
import type { AnswerFollowRequest } from "../../domain/usecases/answer.follow.request";
import type { GetFollowRequests } from "../../domain/usecases/get.follow.requests";
import { type FollowRequestsState, initialFollowRequestsState } from "../models/follow.state";

function messageOf(e: unknown): string {
  return e instanceof ProfileException ? e.message : "Ocurrio un error inesperado";
}

export function useFollowRequestsViewModel(getFollowRequests: GetFollowRequests, answerFollowRequest: AnswerFollowRequest) {
  const [state, setState] = useState<FollowRequestsState>(initialFollowRequestsState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getFollowRequests
      .call()
      .then((requests) => {
        if (!cancelled) setState((c) => ({ ...c, requests, isLoading: false, error: null }));
      })
      .catch((e: unknown) => {
        if (!cancelled) setState((c) => ({ ...c, requests: [], isLoading: false, error: messageOf(e) }));
      });
    return () => {
      cancelled = true;
    };
  }, [getFollowRequests, attempt]);

  function reload(): void {
    setState({ ...initialFollowRequestsState });
    setAttempt((a) => a + 1);
  }

  // aceptar o rechazar; en los dos casos la saco de la lista
  async function answer(username: string, accept: boolean): Promise<void> {
    setState((c) => ({ ...c, busyUsername: username, actionError: null }));
    try {
      await answerFollowRequest.call(username, accept);
      setState((c) => ({ ...c, busyUsername: null, requests: c.requests.filter((r) => r.username !== username) }));
    } catch (e) {
      setState((c) => ({ ...c, busyUsername: null, actionError: messageOf(e) }));
    }
  }

  return { state, reload, answer };
}
