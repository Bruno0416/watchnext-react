import type { AuthRole } from "../../domain/entities/auth.session";
import type { TokensProps } from "../../domain/entities/auth.tokens";

// estado de auth
export type AuthState = {
  tokens: TokensProps | null;
  role: AuthRole | null;
  isLoading: boolean;
};

export const initialAuthState: AuthState = {
  tokens: null,
  role: null,
  isLoading: true,
};

// estado del formulario login
export type LoginState = {
  email: string;
  password: string;

  // errores
  emailError: string | null;
  passwordError: string | null;
  formError: string | null;
};

// estado del formulario registro
export type RegisterState = {
  email: string;
  password: string;
  confirmPassword: string;

  // errores
  emailError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;
  formError: string | null;
};

export type VerifyCodeState = {
  code: string;
  isLoading: boolean;
  error: string | null;
};

export type RecoveryRequestState = {
  email: string;
  emailError: string | null;
  formError: string | null;
  isLoading: boolean;
};

export type ResetPasswordState = {
  password: string;
  confirmPassword: string;
  passwordError: string | null;
  confirmPasswordError: string | null;
  formError: string | null;
  isLoading: boolean;
};
