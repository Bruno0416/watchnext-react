import { Route, Routes } from "react-router";

import { AdminRoute } from "./core/router/admin.route";
import { RootRedirect } from "./core/router/root.redirect";
import { ProtectedRoute } from "./core/router/protected.route";
import { AppLayout } from "./core/layout/app.layout";
import { CodeType } from "./features/auth/domain/entities/code.type";
import { AuthPage } from "./features/auth/presentation/pages/auth.page";
import { LoginPage } from "./features/auth/presentation/pages/login.page";
import { RegisterPage } from "./features/auth/presentation/pages/register.page";
import { RequestRecoveryPage } from "./features/auth/presentation/pages/request.recovery.page";
import { ResetPasswordPage } from "./features/auth/presentation/pages/reset.password.page";
import { VerifyEmailPage } from "./features/auth/presentation/pages/verify.email.page";
import { OnboardingPage } from "./features/onboarding/presentation/pages/onboarding.page";
import { HomePage } from "./features/home/presentation/pages/home.page";
import { MediaPage } from "./features/media/presentation/pages/media.page";
import { ProfilePage } from "./features/profile/presentation/pages/profile.page";
import { ListsPage } from "./features/lists/presentation/pages/lists.page";

// ---------- rutas de la aplicación ----------
function App() {
  return (
    <Routes>
      {/* ---------- redireccion inicial ---------- */}
      <Route path="/" element={<RootRedirect />} />

      {/* ---------- autenticacion ---------- */}
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

      {/* ---------- onboarding ---------- */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* ---------- rutas publicas para invitados ---------- */}
      <Route element={<ProtectedRoute allowGuest />}>
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/media/:mediaType/:tmdbId" element={<MediaPage />} />

          {/* ---------- vistas publicas con contenido segun sesion ---------- */}
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/mis-listas" element={<ListsPage />} />
        </Route>
      </Route>

      {/* ---------- administracion ---------- */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <main>Admin</main>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
