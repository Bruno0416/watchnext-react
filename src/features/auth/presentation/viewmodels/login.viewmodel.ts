import { useState } from "react";
import type { Login } from "../../domain/usecases/login";
import type { LoginState } from "../models/auth.state";
import {
  validateEmail,
  validateLogin,
  validateLoginPassword,
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
  // ---------- estado del formulario ----------
  const [state, setState] = useState<LoginState>(initialLoginState);

  // ---------- actualizacion y validacion de campos ----------
  function setEmail(email: string): void {
    setState((current) => ({
      ...current,
      email,
      emailError: null,
      formError: null,
    }));
  }

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

  function validatePasswordField(): void {
    const passwordError = validateLoginPassword(state.password);

    setState((current) => ({
      ...current,
      passwordError,
    }));
  }

  async function submit(): Promise<boolean> {
    // 1. validar el formulario
    const errors = validateLogin(state.email, state.password);

    // 2. mostrar los errores de validacion
    if (errors.emailError || errors.passwordError) {
      setState((current) => ({
        ...current,
        ...errors,
      }));

      return false;
    }

    // 3. autenticar al usuario cuando los campos son validos
    try {
      await login.call(state.email, state.password);
      return true;
    } catch (e) {
      // 4. mostrar el error recibido durante la autenticacion
      const message =
        e instanceof InvalidCredentialsException
          ? "Correo o contraseña incorrectos, inténtalo de nuevo"
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
