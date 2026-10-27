import { useEffect, useState } from "react";

import { AdminException } from "../../data/errors/admin.exceptions";
import type { GetAdminSummary } from "../../domain/usecases/get.admin.summary";
import { type AdminState, initialAdminState } from "../models/admin.state";

export function useAdminViewModel(getAdminSummary: GetAdminSummary) {
  const [state, setState] = useState<AdminState>(initialAdminState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getAdminSummary
      .call()
      .then((summary) => {
        if (!cancelled) setState({ summary, isLoading: false, error: null });
      })
      .catch((e: unknown) => {
        const msg = e instanceof AdminException ? e.message : "Ocurrio un error inesperado";
        if (!cancelled) setState({ summary: null, isLoading: false, error: msg });
      });
    return () => {
      cancelled = true;
    };
  }, [getAdminSummary, attempt]);

  function reload(): void {
    setState(initialAdminState);
    setAttempt((a) => a + 1);
  }

  return { state, reload };
}
