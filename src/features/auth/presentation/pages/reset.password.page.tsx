import { Navigate, useNavigate, useSearchParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { ResetPassword } from "../../domain/usecases/reset.password";
import { ResetPasswordForm } from "../components/organisms/reset.password.form";
import { useResetPasswordViewModel } from "../viewmodels/reset.password.viewmodel";
import "./style/auth.page.css";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";

  // ---------- dependencias ----------
  const resetPassword = container.resolve<ResetPassword>("resetPassword");

  // ---------- viewmodel ----------
  const viewModel = useResetPasswordViewModel(resetPassword, resetToken);

  async function handleSubmit(): Promise<boolean> {
    // 1. restablecer contrasena
    const success = await viewModel.submit();

    if (!success) {
      return false;
    }

    // 2. volver a autenticacion
    navigate("/auth", { replace: true });
    return true;
  }

  if (!resetToken) {
    return <Navigate to="/auth/recuperar-contrasena" replace />;
  }

  return (
    <main className="auth page shell">
      <section className="auth panel">
        <div className="auth content">
          <header className="auth header">
            <h2 className="auth brand">WatchNext</h2>
            <h1 className="auth title">Nueva contraseña</h1>
            <p className="auth description">
              Define una nueva contraseña para volver a acceder a tu cuenta.
            </p>
          </header>

          <ResetPasswordForm
            state={viewModel.state}
            setPassword={viewModel.setPassword}
            setConfirmPassword={viewModel.setConfirmPassword}
            validatePasswordField={viewModel.validatePasswordField}
            validateConfirmPasswordField={
              viewModel.validateConfirmPasswordField
            }
            submit={handleSubmit}
          />
        </div>
      </section>

      <section className="auth visual" aria-hidden="true" />
    </main>
  );
}
