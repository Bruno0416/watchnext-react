import { useNavigate } from "react-router";
import type { GetSession } from "../../features/auth/domain/usecases/get.session";
import { container } from "../di/container";
import { useAuthViewModel } from "../../features/auth/presentation/viewmodels/auth.viewmodel";
import { AuthRole } from "../../features/auth/domain/entities/auth.session";
import { useEffect } from "react";

export function RootRedirect() {
  const navigate = useNavigate();

  // dependencias
  const getSession = container.resolve<GetSession>("getSession");

  // viewmodel
  const { state } = useAuthViewModel(getSession);

  useEffect(() => {
    // 1. esperar validacion de session
    if (state.isLoading) return;

    // 2. si no existe sesiosion redirigir
    if (!state.tokens || !state.role) {
      navigate("/auth", { replace: true });
      return;
    }

    // 3. redirigir por rol
    if (state.role === AuthRole.ADMIN) {
      navigate("/admin", { replace: true });
      return;
    }

    navigate("/inicio", { replace: true });
  }, [state, navigate]);

  return null;
}
