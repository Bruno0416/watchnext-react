import { useNavigate } from "react-router";
import { container } from "../../../../core/di/container";
import type { Register } from "../../domain/usecases/register";
import { RegisterForm } from "../components/organisms/register.form";
import { useRegisterViewModel } from "../viewmodels/register.viewmodel";
import "./auth.page.css";

export function RegisterPage() {
  const navigate = useNavigate();

  // ----- dependencias -----
  const register = container.resolve<Register>("register");

  // ----- viewModel -----
  const {
    state,
    setEmail,
    setPassword,
    setConfirmPassword,
    validateEmailField,
    validatePasswordField,
    validateConfirmPasswordField,
    submit,
  } = useRegisterViewModel(register);

  async function handleSubmit(): Promise<boolean> {
    // 1. intentar registrar usuario
    const success = await submit();

    // 2. mantener formulario si falla
    if (!success) {
      return false;
    }

    // 3. enviar al inicio de sesion
    navigate("/auth/iniciar-sesion", { replace: true });

    return true;
  }

  return (
    <main className="auth page access">
      <section className="auth content">
        <button
          type="button"
          className="auth back"
          onClick={() => navigate("/auth")}
          aria-label="Volver"
        >
          ←
        </button>

        <header className="auth header">
          <h1 className="auth title">Crear cuenta</h1>

          <p className="auth description">
            Únete a WatchNext y empieza a armar tu lista de seguimiento.
          </p>
        </header>

        <RegisterForm
          state={state}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          submit={handleSubmit}
          validateEmailField={validateEmailField}
          validatePasswordField={validatePasswordField}
          validateConfirmPasswordField={validateConfirmPasswordField}
        />
      </section>
    </main>
  );
}
