import { useNavigate } from "react-router";
import type { GetSession } from "../../domain/usecases/get.session";
import { useEffect, useState } from "react";
import { type AuthState, initialAuthState } from "../models/auth.state";

export function useAuthViewModel(getSession: GetSession): { state: AuthState } {
  const navigate = useNavigate();

  // estado del viewmodel
  const [state, setState] = useState<AuthState>(initialAuthState);

  // useEffect para ejecutar la validacion de sesion al iniciar
  useEffect(() => {
    void validateSession();
  }, []);

  async function validateSession(): Promise<void> {
    // 1. obtener session
    const session = await getSession.call();

    // 2. manejar cuando no existe sesion
    if (!session) {
      setState({
        tokens: null,
        role: null,
        isLoading: false,
      });
      navigate("/auth");
      return;
    }

    // 3. guardar sesion valida
    setState({
      tokens: session.tokens,
      role: session.role,
      isLoading: false,
    });
  }

  return {
    state,
  };
}
