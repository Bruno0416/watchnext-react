import { useState } from "react";

import { AuthException } from "../../data/errors/auth.exceptions";
import type { ResetPassword } from "../../domain/usecases/reset.password";
import type { ResetPasswordState } from "../models/auth.state";
import {
  validateConfirmPassword,
  validateNewPassword,
} from "../validators/auth.validator";

const initialState: ResetPasswordState = {
  password: "",
  confirmPassword: "",
  passwordError: null,
  confirmPasswordError: null,
  formError: null,
  isLoading: false,
};

export function useResetPasswordViewModel(
  resetPassword: ResetPassword,
  resetToken: string,
): {
  state: ResetPasswordState;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  validatePasswordField: () => void;
  validateConfirmPasswordField: () => void;
  submit: () => Promise<boolean>;
} {
  // ---------- estado ----------
  const [state, setState] = useState<ResetPasswordState>(initialState);

  function setPassword(password: string): void {
    setState((current) => ({
      ...current,
      password,
      passwordError: null,
      formError: null,
    }));
  }

  function setConfirmPassword(password: string): void {
    setState((current) => ({
      ...current,
      confirmPassword: password,
      confirmPasswordError: null,
      formError: null,
    }));
  }

  function validatePasswordField(): void {
    const passwordError = validateNewPassword(state.password);

    setState((current) => ({
      ...current,
      passwordError,
    }));
  }

  function validateConfirmPasswordField(): void {
    const confirmPasswordError = validateConfirmPassword(
      state.password,
      state.confirmPassword,
    );

    setState((current) => ({
      ...current,
      confirmPasswordError,
    }));
  }

  async function submit(): Promise<boolean> {
    // 1. validar contrasenas
    const passwordError = validateNewPassword(state.password);
    const confirmPasswordError = validateConfirmPassword(
      state.password,
      state.confirmPassword,
    );

    if (passwordError || confirmPasswordError) {
      setState((current) => ({
        ...current,
        passwordError,
        confirmPasswordError,
      }));
      return false;
    }

    // 2. restablecer contrasena
    setState((current) => ({
      ...current,
      isLoading: true,
      formError: null,
    }));

    try {
      await resetPassword.call(resetToken, state.password);
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
    setPassword,
    setConfirmPassword,
    validatePasswordField,
    validateConfirmPasswordField,
    submit,
  };
}
