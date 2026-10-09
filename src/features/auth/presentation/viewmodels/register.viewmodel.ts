import { useState } from "react";
import type { RegisterState } from "../models/auth.state";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRegister,
} from "../validators/auth.validator";
import type { Register } from "../../domain/usecases/register";
import {
  AuthException,
  EmailAlreadyInUseException,
} from "../../data/errors/auth.exceptions";

const initialRegisterState: RegisterState = {
  email: "",
  password: "",
  confirmPassword: "",
  emailError: null,
  passwordError: null,
  confirmPasswordError: null,
  validateEmailField: null,
  validatePasswordField: null,
  validateConfirmPasswordField: null,
  formError: null,
};

export function useRegisterViewModel(register: Register): {
  state: RegisterState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  validateEmailField: () => void;
  validatePasswordField: () => void;
  validateConfirmPasswordField: () => void;
  submit: () => Promise<boolean>;
} {
  // crear estado
  const [state, setState] = useState<RegisterState>(initialRegisterState);

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

  function setConfirmPassword(password: string): void {
    setState((current) => ({
      ...current,
      confirmPassword: password,
      confirmPasswordError: null,
      formError: null,
    }));
  }

  // validar campo contrasenia
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
    // 1. validar form
    const errors = validateRegister(
      state.email,
      state.password,
      state.confirmPassword,
    );

    // 2. actualizar estado con errores
    if (
      errors.emailError ||
      errors.passwordError ||
      errors.confirmPasswordError
    ) {
      setState((current) => ({
        ...current,
        emailError: errors.emailError,
        passwordError: errors.passwordError,
        confirmPasswordError: errors.confirmPasswordError,
      }));

      return false;
    }

    // 3. llamar al usecase
    try {
      await register.call(state.email, state.password);
      return true;
    } catch (e) {
      const message =
        e instanceof EmailAlreadyInUseException
          ? "El correo ya está registrado"
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
    setConfirmPassword,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    submit,
  };
}
