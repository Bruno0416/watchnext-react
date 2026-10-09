import { useState } from "react";
import type { Login } from "../../domain/usecases/login";
import type { LoginState } from "../models/auth.state";
import {
  validateEmail,
  validateLogin,
  validatePassword,
} from "../validators/auth.validator";
import {
  AuthException,
  InvalidCredentialsException,
} from "../../data/errors/auth.exceptions";

const initialLoginState: LoginState = {
  email: "",
  password: "",
  emailError: null,
  passwordError: null,
  formError: null,
};

export function useLoginViewModel(login: Login): {
  state: LoginState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  validateEmailField: () => void;
  validatePasswordField: () => void;
  submit: () => Promise<boolean>;
} {
  "";
  // crear estado
  const [state, setState] = useState<LoginState>(initialLoginState);

  // actualizar estado correo
  function setEmail(email: string): void {
    setState((current) => ({
      ...current,
      email,
      emailError: null,
      formError: null,
    }));
  }

  // validar campo correo
  function validateEmailField(): void {
    const emailError = validateEmail(state.email);

    setState((current) => ({
      ...current,
      emailError,
    }));
  }

  function setPassword(password: string): void {
    setState((current) => ({
      ...current,
      password,
      passwordError: null,
      formError: null,
    }));
  }

  // validar campo contrasenia
  function validatePasswordField(): void {
    const passwordError = validatePassword(state.password);

    setState((current) => ({
      ...current,
      passwordError,
    }));
  }

  async function submit(): Promise<boolean> {
    // 1. validar forumulario
    const errors = validateLogin(state.email, state.password);

    // 2. si hay errores actualizamos el estado
    if (errors.emailError || errors.passwordError) {
      setState((current) => ({
        ...current,
        ...errors,
      }));

      return false;
    }

    // 3. llamar al usecase si no hay errores
    try {
      await login.call(state.email, state.password);
      return true;
    } catch (e) {
      const message =
        e instanceof InvalidCredentialsException
          ? "Correo o contraseña incorrectos"
          : e instanceof AuthException
            ? e.message
            : "Ocurrio un error inesperado";

      setState((current) => ({
        ...current,
        formError: message,
      }));

      return false;
    }
  }

  return {
    state,
    setEmail,
    setPassword,
    validateEmailField,
    validatePasswordField,
    submit,
  };
}
