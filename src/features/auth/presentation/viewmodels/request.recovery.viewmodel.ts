import { useState } from "react";

import { AuthException } from "../../data/errors/auth.exceptions";
import type { RequestPasswordReset } from "../../domain/usecases/request.password.reset";
import type { RecoveryRequestState } from "../models/auth.state";
import { validateEmail } from "../validators/auth.validator";

const initialState: RecoveryRequestState = {
  email: "",
  emailError: null,
  formError: null,
  isLoading: false,
};

export function useRequestRecoveryViewModel(
  requestPasswordReset: RequestPasswordReset,
): {
  state: RecoveryRequestState;
  setEmail: (email: string) => void;
  validateEmailField: () => void;
  submit: () => Promise<boolean>;
} {
  // ---------- estado ----------
  const [state, setState] = useState<RecoveryRequestState>(initialState);

  function setEmail(email: string): void {
    setState((current) => ({
      ...current,
      email,
      emailError: null,
      formError: null,
    }));
  }

  function validateEmailField() {
    const emailError = validateEmail(state.email);

    setState((current) => ({
      ...current,
      emailError,
    }));
  }

  async function submit(): Promise<boolean> {
    // 1. validar correo
    const emailError = validateEmail(state.email);

    if (emailError) {
      setState((current) => ({
        ...current,
        emailError,
      }));
      return false;
    }

    // 2. solicitar recuperacion
    setState((current) => ({
      ...current,
      isLoading: true,
      formError: null,
    }));

    try {
      await requestPasswordReset.call(state.email.trim());
      return true;
    } catch (e) {
      // 3. mostrar error
      const message =
        e instanceof AuthException ? e.message : "Ocurrio un error inesperado";

      setState((current) => ({
        ...current,
        isLoading: false,
        formError: message,
      }));

      return false;
    }
  }

  return {
    state,
    setEmail,
    validateEmailField,
    submit,
  };
}
