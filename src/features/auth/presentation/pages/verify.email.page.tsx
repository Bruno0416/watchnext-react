import { Navigate, useNavigate, useSearchParams } from "react-router";

import { container } from "../../../../core/di/container";
import { CodeType } from "../../domain/entities/code.type";
import type { VerifyEmail } from "../../domain/usecases/verify.email";
import type { VerifyResetCode } from "../../domain/usecases/verify.reset.code";
import { useVerifyViewModel } from "../viewmodels/verify.viewmodel";
import "./style/auth.page.css";
import { OtpInput } from "../components/molecules/otp.input";

import "./style/auth.page.css";
import "./style/verify.email.page.css";
import { Button } from "../components/atoms/button";

type VerifyEmailPageProps = {
  codeType: CodeType;
};

export function VerifyEmailPage({ codeType }: VerifyEmailPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const isRecovery = codeType === CodeType.PASSWORD_RECOVERY;

  // ---------- dependencias ----------
  const verifyEmail = container.resolve<VerifyEmail>("verifyEmail");
  const verifyResetCode = container.resolve<VerifyResetCode>("verifyResetCode");

  // ---------- viewmodel ----------
  const { state, setCode, validateCodeField, submit } = useVerifyViewModel(
    verifyEmail,
    verifyResetCode,
    email,
    codeType,
  );

  async function handleSubmit(): Promise<boolean> {
    // 1. verificar codigo
    const result = await submit();

    if (!result.success) {
      return false;
    }

    // 2. continuar flujo correspondiente
    if (isRecovery && result.resetToken) {
      navigate(
        `/auth/restablecer-contrasena?token=${encodeURIComponent(result.resetToken)}`,
        { replace: true },
      );
      return true;
    }

    navigate("/auth", { replace: true });
    return true;
  }

  if (!email) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <main className="auth page shell">
      <section className="auth panel">
        <div className="auth content">
          <header className="auth header">
            <h2 className="auth brand">WatchNext</h2>
            <h1 className="auth title">
              {isRecovery ? "Verifica tu codigo" : "Verifica tu correo"}
            </h1>
            <p className="auth description">
              Ingresa el codigo que enviamos a {email}.
            </p>
          </header>

          <OtpInput
            value={state.code}
            onChange={setCode}
            onBlur={validateCodeField}
          />

          <div className="auth verify actions">
            <Button variant="primary" onClick={handleSubmit}>
              {isRecovery ? "Continuar" : "Verificar correo"}
            </Button>
          </div>
        </div>
      </section>

      <section className="auth visual" aria-hidden="true" />
    </main>
  );
}
