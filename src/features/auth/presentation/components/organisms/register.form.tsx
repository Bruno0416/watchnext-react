import { useState, type SubmitEventHandler } from "react";

import type { RegisterState } from "../../models/auth.state";
import { Button } from "../atoms/button";
import { FormField } from "../molecules/form.field";
import { AuthSwitch } from "../molecules/auth.switch";

type RegisterFormProps = {
  state: RegisterState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  validateEmailField: () => void;
  validatePasswordField: () => void;
  validateConfirmPasswordField: () => void;
  onSwitch?: () => void;
  submit: () => Promise<boolean>;
};

export function RegisterForm({
  state,
  setEmail,
  setPassword,
  setConfirmPassword,
  validateEmailField,
  validatePasswordField,
  validateConfirmPasswordField,
  onSwitch,
  submit,
}: RegisterFormProps) {
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
          label="Email"
          value={state.email}
          placeholder="correo@ejemplo.com"
          leadingIcon="envelope-fill"
          error={state.emailError}
          onChange={setEmail}
          onBlur={validateEmailField}
        />

        <FormField
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={state.password}
          placeholder="Ingresa tu contraseña"
          error={state.passwordError}
          leadingIcon="lock-fill"
          trailingIcon={showPassword ? "eye-fill" : "eye-slash-fill"}
          onTrailingClick={() => setShowPassword((current) => !current)}
          onChange={setPassword}
          onBlur={validatePasswordField}
        />

        <FormField
          label="Confirmar contraseña"
          type={showConfirmPassword ? "text" : "password"}
          value={state.confirmPassword}
          placeholder="Repite tu contraseña"
          error={state.confirmPasswordError}
          leadingIcon="lock-fill"
          trailingIcon={showConfirmPassword ? "eye-fill" : "eye-slash-fill"}
          onTrailingClick={() => setShowConfirmPassword((current) => !current)}
          onChange={setConfirmPassword}
          onBlur={validateConfirmPasswordField}
        />
      </div>

      {state.formError && <p className="auth error">{state.formError}</p>}

      <Button type="submit" className="auth submit">
        Registrarse
      </Button>

      <AuthSwitch type="register" onSwitch={onSwitch} />
    </form>
  );
}
