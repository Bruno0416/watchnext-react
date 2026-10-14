import { Route, Routes } from "react-router";

import { AdminRoute } from "./core/router/admin.route";
import { RootRedirect } from "./core/router/root.redirect";
import { CodeType } from "./features/auth/domain/entities/code.type";
import { AuthPage } from "./features/auth/presentation/pages/auth.page";
import { LoginPage } from "./features/auth/presentation/pages/login.page";
import { RegisterPage } from "./features/auth/presentation/pages/register.page";
import { RequestRecoveryPage } from "./features/auth/presentation/pages/request.recovery.page";
import { ResetPasswordPage } from "./features/auth/presentation/pages/reset.password.page";
import { VerifyEmailPage } from "./features/auth/presentation/pages/verify.email.page";

// ---------- rutas de la aplicación ----------
function App() {
  return (
    <>
      {/* <Navbar/>*/}

      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/iniciar-sesion" element={<LoginPage />} />
        <Route path="/auth/registrarse" element={<RegisterPage />} />
        <Route
          path="/auth/verificar-correo"
          element={<VerifyEmailPage codeType={CodeType.CONFIRMATION} />}
        />
        <Route
          path="/auth/recuperar-contrasena"
          element={<RequestRecoveryPage />}
        />
        <Route
          path="/auth/verificar-recuperacion"
          element={<VerifyEmailPage codeType={CodeType.PASSWORD_RECOVERY} />}
        />
        <Route
          path="/auth/restablecer-contrasena"
          element={<ResetPasswordPage />}
        />

        <Route path="/inicio" element={<main>Home</main>} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <main>Admin</main>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
