import { useState } from "react";

import {
  AuthException,
  BadRequestException,
} from "../../data/errors/auth.exceptions";
import { CodeType } from "../../domain/entities/code.type";
import type { VerifyEmail } from "../../domain/usecases/verify.email";
import type { VerifyResetCode } from "../../domain/usecases/verify.reset.code";
import type { VerifyCodeState } from "../models/auth.state";
import { validateCode } from "../validators/auth.validator";

type VerifyCodeResult = {
  success: boolean;
  resetToken: string | null;
};

const initialState: VerifyCodeState = {
  code: "",
  isLoading: false,
  error: null,
};

export function useVerifyViewModel(
  verifyEmail: VerifyEmail,
  verifyResetCode: VerifyResetCode,
  email: string,
  codeType: CodeType,
): {
  state: VerifyCodeState;
  setCode: (code: string) => void;
  validateCodeField: () => void;
  submit: () => Promise<VerifyCodeResult>;
} {
  // ---------- estado ----------
  const [state, setState] = useState<VerifyCodeState>(initialState);

  function setCode(code: string): void {
    setState((current) => ({
      ...current,
      code,
      error: null,
    }));
  }

  function validateCodeField(): void {
    const error = validateCode(state.code);

    setState((current) => ({
      ...current,
      error,
    }));
  }

  async function submit(): Promise<VerifyCodeResult> {
    // 1. validar codigo
    const error = validateCode(state.code);

    if (error) {
      setState((current) => ({ ...current, error }));
      return { success: false, resetToken: null };
    }

    // 2. iniciar verificacion
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      // 3. ejecutar verificacion segun tipo
      const code = state.code.trim().toUpperCase();

      if (codeType === CodeType.CONFIRMATION) {
        await verifyEmail.call(email, code);
        return { success: true, resetToken: null };
      }

      const resetToken = await verifyResetCode.call(email, code);
      return { success: true, resetToken };
    } catch (e) {
      // 4. mostrar error
      const message =
        e instanceof BadRequestException
          ? "El codigo de verificacion es invalido"
          : e instanceof AuthException
            ? e.message
            : "Ocurrio un error inesperado";

      setState((current) => ({
        ...current,
        isLoading: false,
        error: message,
      }));

      return { success: false, resetToken: null };
    }
  }

  return { state, setCode, validateCodeField, submit };
}
