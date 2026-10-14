import type { SubmitEventHandler } from "react";

import type { VerifyCodeState } from "../../models/auth.state";
import { Button } from "../atoms/button";
import { FormField } from "../molecules/form.field";

type VerifyEmailFormProps = {
  state: VerifyCodeState;
  submitLabel: string;
  setCode: (code: string) => void;
  validateCodeField: () => void;
  submit: () => Promise<boolean>;
};

export function VerifyEmailForm({
  state,
  submitLabel,
  setCode,
  validateCodeField,
  submit,
}: VerifyEmailFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="auth form" onSubmit={handleSubmit}>
      <div className="auth fields">
        <FormField
          label="Codigo de verificacion"
          value={state.code}
          placeholder="Ingresa el codigo"
          leadingIcon="shield-check"
          error={state.error}
          disabled={state.isLoading}
          onChange={setCode}
          onBlur={validateCodeField}
        />
      </div>

      <Button type="submit" className="auth submit" disabled={state.isLoading}>
        {state.isLoading ? "Verificando..." : submitLabel}
      </Button>
    </form>
  );
}
