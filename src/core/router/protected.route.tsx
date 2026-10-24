import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

import { container } from "../di/container";
import { AuthRole } from "../../features/auth/domain/entities/auth.session";
import type { GetSession } from "../../features/auth/domain/usecases/get.session";
import type { CheckOnboardingStatus } from "../../features/onboarding/domain/usecases/check.onboarding.status";

type AccessStatus =
  | "checking"
  | "authorized"
  | "guest"
  | "unauthenticated"
  | "onboarding"
  | "admin"
  | "error";

type ProtectedRouteProps = {
  allowGuest?: boolean;
};

const GuestAccessContext = createContext(false);

export function useGuestAccess(): boolean {
  return useContext(GuestAccessContext);
}

export function ProtectedRoute({ allowGuest = false }: ProtectedRouteProps) {
  // ---------- estado ----------
  const [status, setStatus] = useState<AccessStatus>("checking");

  // ---------- validacion de acceso ----------
  useEffect(() => {
    const getSession = container.resolve<GetSession>("getSession");
    const checkOnboardingStatus = container.resolve<CheckOnboardingStatus>(
      "checkOnboardingStatus",
    );

    let active = true;

    async function validateAccess(): Promise<void> {
      try {
        // 1. obtener sesion
        const session = await getSession.call();

        if (!active) return;

        // 2. comprobar acceso de invitado
        if (!session) {
          setStatus(allowGuest ? "guest" : "unauthenticated");
          return;
        }

        // 3. comprobar administrador
        if (session.role === AuthRole.ADMIN) {
          setStatus("admin");
          return;
        }

        // 4. comprobar onboarding
        const completed = await checkOnboardingStatus.call();

        if (!active) return;

        setStatus(completed ? "authorized" : "onboarding");
      } catch (error) {
        // 5. manejar error
        if (active) {
          console.error("[ERROR] validacion de acceso", error);
          setStatus("error");
        }
      }
    }

    void validateAccess();

    return () => {
      active = false;
    };
  }, [allowGuest]);

  // ---------- renderizado ----------
  if (status === "checking") {
    return <main role="status">Validando acceso...</main>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth" replace />;
  }

  if (status === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (status === "onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (status === "error") {
    return (
      <main role="alert">
        No se pudo validar el acceso. Intenta recargar la página.
      </main>
    );
  }

  return (
    <GuestAccessContext.Provider value={status === "guest"}>
      <Outlet />
    </GuestAccessContext.Provider>
  );
}
