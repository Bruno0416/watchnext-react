import { useState } from "react";
import { useNavigate } from "react-router";

import { container } from "../../../../core/di/container";
import type { Login } from "../../domain/usecases/login";
import type { Register } from "../../domain/usecases/register";
import { Button } from "../components/atoms/button";
import { LoginForm } from "../components/organisms/login.form";
import { RegisterForm } from "../components/organisms/register.form";
import { useLoginViewModel } from "../viewmodels/login.viewmodel";
import { useRegisterViewModel } from "../viewmodels/register.viewmodel";
import "./style/auth.page.css";

type AuthMode = "login" | "register";

export function AuthPage() {
  const navigate = useNavigate();

  // ----- estado -----
  const [mode, setMode] = useState<AuthMode>("login");

  // ----- dependencias -----
  const login = container.resolve<Login>("login");
  const register = container.resolve<Register>("register");

  // ----- viewModel -----
  const loginViewModel = useLoginViewModel(login);
  const registerViewModel = useRegisterViewModel(register);

  async function handleLoginSubmit(): Promise<boolean> {
    // 1. intentar iniciar sesion
    const success = await loginViewModel.submit();

    // 2. mantener formulario si falla
    if (!success) {
      return false;
    }

    // 3. delegar redireccion segun sesion
    navigate("/", { replace: true });

    return true;
  }

  async function handleRegisterSubmit(): Promise<boolean> {
    // 1. intentar registrar usuario
    const success = await registerViewModel.submit();

    // 2. mantener formulario si falla
    if (!success) {
      return false;
    }

    // 3. enviar a verificacion de correo
    navigate(
      `/auth/verificar-correo?email=${encodeURIComponent(
        registerViewModel.state.email.trim(),
      )}`,
    );

    return true;
  }

  return (
    <main className="auth page shell">
      <section className="auth panel">
        <Button
          variant="link"
          className="auth skip"
          onClick={() => navigate("/inicio")}
        >
          Saltar por ahora
        </Button>

        <div className="auth content">
          <header className="auth header">
            <h2 className="auth brand">WatchNext</h2>

            <h1 className="auth title">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>

            <p className="auth description">
              {mode === "login"
                ? "¡Bienvenido de nuevo! Inicia sesión para seguir el control de lo que estás viendo."
                : "Únete a WatchNext y empieza a armar tu lista de seguimiento."}
            </p>
          </header>

          {mode === "login" ? (
            <LoginForm
              state={loginViewModel.state}
              setEmail={loginViewModel.setEmail}
              setPassword={loginViewModel.setPassword}
              submit={handleLoginSubmit}
              validateEmailField={loginViewModel.validateEmailField}
              validatePasswordField={loginViewModel.validatePasswordField}
              onSwitch={() => setMode("register")}
            />
          ) : (
            <RegisterForm
              state={registerViewModel.state}
              setEmail={registerViewModel.setEmail}
              setPassword={registerViewModel.setPassword}
              setConfirmPassword={registerViewModel.setConfirmPassword}
              submit={handleRegisterSubmit}
              validateEmailField={registerViewModel.validateEmailField}
              validatePasswordField={registerViewModel.validatePasswordField}
              validateConfirmPasswordField={
                registerViewModel.validateConfirmPasswordField
              }
              onSwitch={() => setMode("login")}
            />
          )}
        </div>
      </section>

      <section className="auth visual" aria-hidden="true" />
    </main>
  );
}
