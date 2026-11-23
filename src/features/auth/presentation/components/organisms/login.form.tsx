import { useState } from "react";
import type { SubmitEventHandler } from "react";

import type { LoginState } from "../../models/auth.state";
import { Button } from "../atoms/button";
import { FormField } from "../molecules/form.field";
import { TextLink } from "../atoms/text.link";
import { AuthSwitch } from "../molecules/auth.switch";

type LoginFormProps = {
  state: LoginState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  validateEmailField: () => void;
  validatePasswordField: () => void;
  onSwitch?: () => void;
  submit: () => Promise<boolean>;
};

export function LoginForm({
  state,
  setEmail,
  validateEmailField,
  setPassword,
  validatePasswordField,
  onSwitch,
  submit,
}: LoginFormProps) {
  // ---------- estado ----------
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await submit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth form" onSubmit={handleSubmit}>
      <div className="auth fields">
        <FormField
          label="Email"
          value={state.email}
          placeholder="correo@ejemplo.com"
          error={state.emailError}
          leadingIcon="envelope-fill"
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
          trailingLabel={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          trailingPressed={showPassword}
          onChange={setPassword}
          onTrailingClick={() => setShowPassword((current) => !current)}
          onBlur={validatePasswordField}
        />
        <TextLink className="auth forgot" to="/auth/recuperar-contrasena">
          ¿Olvidaste tu contraseña?
        </TextLink>
      </div>

      {state.formError && <p className="auth error">{state.formError}</p>}

      <Button type="submit" className="auth submit" disabled={submitting}>
        {submitting && (
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        )}
        {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <AuthSwitch type="login" onSwitch={onSwitch} />
    </form>
  );
}
