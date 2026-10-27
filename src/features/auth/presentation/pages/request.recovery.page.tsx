import { useNavigate } from "react-router";

import { container } from "../../../../core/di/container";
import type { RequestPasswordReset } from "../../domain/usecases/request.password.reset";
import { RequestRecoveryForm } from "../components/organisms/request.recovery.form";
import { useRequestRecoveryViewModel } from "../viewmodels/request.recovery.viewmodel";
import "./style/auth.page.css";

export function RequestRecoveryPage() {
  const navigate = useNavigate();

  // ---------- dependencias ----------
  const requestPasswordReset =
    container.resolve<RequestPasswordReset>("requestPasswordReset");

  // ---------- viewmodel ----------
  const viewModel = useRequestRecoveryViewModel(requestPasswordReset);

  async function handleSubmit(): Promise<boolean> {
    // 1. solicitar recuperacion
    const success = await viewModel.submit();

    if (!success) {
      return false;
    }

    // 2. continuar a verificacion
    navigate(
      `/auth/verificar-recuperacion?email=${encodeURIComponent(
        viewModel.state.email.trim(),
      )}`,
    );

    return true;
  }

  return (
    <main className="auth page shell">
      <section className="auth panel">
        <div className="auth content">
          <header className="auth header">
            <h2 className="auth brand">WatchNext</h2>
            <h1 className="auth title">Recuperar contraseña</h1>
            <p className="auth description">
              Ingresa tu correo para continuar con la recuperacion de tu cuenta.
            </p>
          </header>

          <RequestRecoveryForm
            state={viewModel.state}
            setEmail={viewModel.setEmail}
            validateEmailField={viewModel.validateEmailField}
            submit={handleSubmit}
          />
        </div>
      </section>

      <section className="auth visual" aria-hidden="true" />
    </main>
  );
}
