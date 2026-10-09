import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

import { container } from "../di/container";
import type { GetSession } from "../../features/auth/domain/usecases/get.session";
import { AuthRole } from "../../features/auth/domain/entities/auth.session";
import { useAuthViewModel } from "../../features/auth/presentation/viewmodels/auth.viewmodel";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const navigate = useNavigate();

  // ------ dependencias ------
  const getSession = container.resolve<GetSession>("getSession");

  // ------ viewmodel ------
  const { state } = useAuthViewModel(getSession);

  // ------ navegacion ------
  useEffect(() => {
    // 1. esperar validacion de sesion
    if (state.isLoading) {
      return;
    }

    // 2. enviar a auth si no existe sesion
    if (!state.tokens || state.role === null) {
      navigate("/auth", { replace: true });
      return;
    }

    // 3. rechazar acceso si no es admin
    if (state.role !== AuthRole.ADMIN) {
      navigate("/inicio", { replace: true });
    }
  }, [state, navigate]);

  // ------ renderizado ------
  // 1. no renderizar mientras se valida
  if (state.isLoading) {
    return null;
  }

  // 2. no renderizar contenido protegido durante redireccion
  if (!state.tokens || state.role !== AuthRole.ADMIN) {
    return null;
  }

  // 3. permitir acceso
  return <>{children}</>;
}
