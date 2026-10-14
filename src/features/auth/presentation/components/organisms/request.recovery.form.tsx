import type { SubmitEventHandler } from "react";

import type { RecoveryRequestState } from "../../models/auth.state";
import { Button } from "../atoms/button";
import { TextLink } from "../atoms/text.link";
import { FormField } from "../molecules/form.field";

type RequestRecoveryFormProps = {
  state: RecoveryRequestState;
  setEmail: (email: string) => void;
  validateEmailField: () => void;
  submit: () => Promise<boolean>;
};

export function RequestRecoveryForm({
  state,
  setEmail,
  validateEmailField,
  submit,
}: RequestRecoveryFormProps) {
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
          error={state.emailError}
          disabled={state.isLoading}
          leadingIcon="envelope-fill"
          onChange={setEmail}
          onBlur={validateEmailField}
        />
      </div>

      {state.formError && <p className="auth error">{state.formError}</p>}

      <Button type="submit" className="auth submit" disabled={state.isLoading}>
        {state.isLoading ? "Enviando..." : "Enviar codigo"}
      </Button>

      <div className="auth switch">
        <span>¿Recordaste tu contraseña?</span>
        <TextLink to="/auth">Iniciar sesion</TextLink>
      </div>
    </form>
  );
}
