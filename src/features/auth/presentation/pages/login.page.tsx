import { useNavigate } from "react-router";
import { container } from "../../../../core/di/container";
import type { Login } from "../../domain/usecases/login";
import { LoginForm } from "../components/organisms/login.form";
import { useLoginViewModel } from "../viewmodels/login.viewmodel";
import "./auth.page.css";

export function LoginPage() {
  const navigate = useNavigate();

  // ----- dependencias -----
  const login = container.resolve<Login>("login");

  // ----- viewModel -----
  const {
    state,
    setEmail,
    setPassword,
    validateEmailField,
    validatePasswordField,
    submit,
  } = useLoginViewModel(login);

  async function handleSubmit(): Promise<boolean> {
    // 1. intentar iniciar sesion
    const success = await submit();

    // 2. mantener formulario si falla
    if (!success) {
      return false;
    }

    // 3. delegar redireccion segun sesion
    navigate("/", { replace: true });

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
          <h1 className="auth title">Iniciar sesion</h1>

          <p className="auth description">
            ¡Bienvenido de nuevo! Inicia sesión para seguir el control de lo que
            estás viendo.
          </p>
        </header>

        <LoginForm
          state={state}
          setEmail={setEmail}
          setPassword={setPassword}
          submit={handleSubmit}
          validateEmailField={validateEmailField}
          validatePasswordField={validatePasswordField}
        />
      </section>
    </main>
  );
}
