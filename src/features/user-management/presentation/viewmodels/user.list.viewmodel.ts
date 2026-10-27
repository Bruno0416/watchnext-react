import { useEffect, useState } from "react";

import { UserManagementException } from "../../data/errors/user.management.exceptions";
import type { AdminUser } from "../../domain/entities/admin.user";
import type { SearchUsers } from "../../domain/usecases/search.users";
import { initialUserListState, type RoleFilter, type UserListState } from "../models/user.management.state";

function messageOf(e: unknown): string {
  return e instanceof UserManagementException ? e.message : "Ocurrio un error inesperado";
}

// el filtro de rol lo hago aca; el de texto lo hace el servicio
export function filtrarPorRol(users: AdminUser[], role: RoleFilter): AdminUser[] {
  if (role === "ALL") return users;
  return users.filter((u) => u.role === role);
}

export function useUserListViewModel(searchUsers: SearchUsers, delayMs = 250) {
  const [state, setState] = useState<UserListState>(initialUserListState);
  const [attempt, setAttempt] = useState(0);

  // busco cuando cambia el texto, con una pausa para no buscar en cada letra
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      searchUsers
        .call(state.query)
        .then((users) => {
          if (!cancelled) setState((c) => ({ ...c, users, isLoading: false, error: null }));
        })
        .catch((e: unknown) => {
          if (!cancelled) setState((c) => ({ ...c, users: [], isLoading: false, error: messageOf(e) }));
        });
    }, delayMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchUsers, state.query, attempt, delayMs]);

  function setQuery(query: string): void {
    setState((c) => ({ ...c, query }));
  }

  function setRole(role: RoleFilter): void {
    setState((c) => ({ ...c, role }));
  }

  function reload(): void {
    setState((c) => ({ ...c, isLoading: true, error: null }));
    setAttempt((a) => a + 1);
  }

  return { state, visibles: filtrarPorRol(state.users, state.role), setQuery, setRole, reload };
}
