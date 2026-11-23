import { useNavigate } from "react-router";
import type { GetSession } from "../../features/auth/domain/usecases/get.session";
import { container } from "../di/container";
import { useAuthViewModel } from "../../features/auth/presentation/viewmodels/auth.viewmodel";
import { AuthRole } from "../../features/auth/domain/entities/auth.session";
import { useEffect } from "react";
import type { CheckOnboardingStatus } from "../../features/onboarding/domain/usecases/check.onboarding.status";

export function RootRedirect() {
  const navigate = useNavigate();

  // ---- dependencias ----
  const getSession = container.resolve<GetSession>("getSession");
  const checkOnboardingStatus = container.resolve<CheckOnboardingStatus>(
    "checkOnboardingStatus",
  );

  // ---- viewmodel ----
  const { state } = useAuthViewModel(getSession);

  useEffect(() => {
    async function redirect(): Promise<void> {
      // 1. esperar la validacion de la sesion
      if (state.isLoading) return;

      // 2. redirigir al acceso si no existe sesion
      if (!state.tokens || !state.role) {
        navigate("/auth", { replace: true });
        return;
      }

      // 3. redirigir por rol
      if (state.role === AuthRole.ADMIN) {
        navigate("/admin", { replace: true });
        return;
      }

      // 4. comprobar onboarding
      try {
        const onboardingcompleted = await checkOnboardingStatus.call();

        // 5. redirigir segun el estado del perfil
        navigate(onboardingcompleted ? "/inicio" : "/onboarding", {
          replace: true,
        });
      } catch (error) {
        if (!(await getSession.call())) {
          navigate("/auth", { replace: true });
          return;
        }
        console.error(
          "[ERROR] no se pudo comprobar el estado del onboarding",
          error,
        );
      }
    }
    void redirect();
  }, [state.isLoading, state.tokens, state.role, navigate]);

  return null;
}
