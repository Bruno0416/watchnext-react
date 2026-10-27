import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import { container } from "../di/container";
import type { GetSession } from "../../features/auth/domain/usecases/get.session";
import { useAuthViewModel } from "../../features/auth/presentation/viewmodels/auth.viewmodel";

type UserRouteProps = {
  children: ReactNode;
};

// igual que AdminRoute pero deja pasar a cualquiera que tenga sesion
// la uso para las pantallas "propias" como mis listas
export function UserRoute({ children }: UserRouteProps) {
  const navigate = useNavigate();

  // ------ dependencias ------
  const getSession = container.resolve<GetSession>("getSession");

  // ------ viewmodel ------
  const { state } = useAuthViewModel(getSession);

  // ------ navegacion ------
  useEffect(() => {
    if (state.isLoading) return;

    // sin sesion lo mando a auth
    if (!state.tokens || state.role === null) {
      navigate("/auth", { replace: true });
    }
  }, [state, navigate]);

  // no muestro nada mientras valido ni mientras redirijo
  if (state.isLoading || !state.tokens || state.role === null) {
    return null;
  }

  return <>{children}</>;
}
