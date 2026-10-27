import { useState, type SubmitEventHandler } from "react";

import type { ResetPasswordState } from "../../models/auth.state";
import { Button } from "../atoms/button";
import { FormField } from "../molecules/form.field";

type ResetPasswordFormProps = {
  state: ResetPasswordState;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  validatePasswordField: () => void;
  validateConfirmPasswordField: () => void;
  submit: () => Promise<boolean>;
};

export function ResetPasswordForm({
  state,
  setPassword,
  setConfirmPassword,
  validatePasswordField,
  validateConfirmPasswordField,
  submit,
}: ResetPasswordFormProps) {
  // ---------- estado ----------
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="auth form" onSubmit={handleSubmit}>
      <div className="auth fields">
        <FormField
          label="Nueva contraseña"
          type={showPassword ? "text" : "password"}
          value={state.password}
          placeholder="Ingresa tu nueva contraseña"
          error={state.passwordError}
          disabled={state.isLoading}
          leadingIcon="lock-fill"
          trailingIcon={showPassword ? "eye-fill" : "eye-slash-fill"}
          trailingLabel={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          trailingPressed={showPassword}
          onChange={setPassword}
          onBlur={validatePasswordField}
          onTrailingClick={() => setShowPassword((current) => !current)}
        />

        <FormField
          label="Confirmar contraseña"
          type={showConfirmPassword ? "text" : "password"}
          value={state.confirmPassword}
          placeholder="Repite tu nueva contraseña"
          error={state.confirmPasswordError}
          disabled={state.isLoading}
          leadingIcon="lock-fill"
          trailingIcon={showConfirmPassword ? "eye-fill" : "eye-slash-fill"}
          trailingLabel={
            showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          trailingPressed={showConfirmPassword}
          onChange={setConfirmPassword}
          onBlur={validateConfirmPasswordField}
          onTrailingClick={() =>
            setShowConfirmPassword((current) => !current)
          }
        />
      </div>

      {state.formError && <p className="auth error">{state.formError}</p>}

      <Button type="submit" className="auth submit" disabled={state.isLoading}>
        {state.isLoading ? "Guardando..." : "Restablecer contraseña"}
      </Button>
    </form>
  );
}
