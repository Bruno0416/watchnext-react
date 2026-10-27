import { Navigate, Route, Routes } from "react-router";

import { AdminRoute } from "./core/router/admin.route";
import { RootRedirect } from "./core/router/root.redirect";
import { ProtectedRoute } from "./core/router/protected.route";
import { UserRoute } from "./core/router/user.route";
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
import { FollowListPage } from "./features/profile/presentation/pages/follow.list.page";
import { FollowRequestsPage } from "./features/profile/presentation/pages/follow.requests.page";
import { ListsPage } from "./features/lists/presentation/pages/lists.page";
import { ListDetailPage } from "./features/lists/presentation/pages/list.detail.page";
import { NewsPage } from "./features/news/presentation/pages/news.page";
import { AboutPage } from "./features/about/presentation/pages/about.page";
import { ContactPage } from "./features/contact/presentation/pages/contact.page";
import { NewsDetailPage } from "./features/news/presentation/pages/news.detail.page";
import { AdminPage } from "./features/admin/presentation/pages/admin.page";
import { UsersPage } from "./features/user-management/presentation/pages/users.page";
import { UserDetailPage } from "./features/user-management/presentation/pages/user.detail.page";
import { NewsManagementPage } from "./features/news-management/presentation/pages/news.management.page";

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

      {/* ---------- paginas con navegacion compartida ---------- */}
      <Route element={<ProtectedRoute allowGuest />}>
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/media/:mediaType/:tmdbId" element={<MediaPage />} />

          {/* ---------- noticias publicas ---------- */}
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/noticias/:id" element={<NewsDetailPage />} />

          {/* ---------- perfiles y relaciones ---------- */}
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/perfil/:username" element={<ProfilePage />} />
          <Route
            path="/perfil/:username/seguidores"
            element={<FollowListPage mode="followers" />}
          />
          <Route
            path="/perfil/:username/seguidos"
            element={<FollowListPage mode="following" />}
          />
          <Route
            path="/perfil/solicitudes"
            element={
              <UserRoute>
                <FollowRequestsPage />
              </UserRoute>
            }
          />

          {/* ---------- listas personales y detalle ---------- */}
          <Route path="/mis-listas" element={<ListsPage />} />
          <Route path="/listas" element={<Navigate to="/mis-listas" replace />} />
          <Route
            path="/listas/:id"
            element={
              <UserRoute>
                <ListDetailPage />
              </UserRoute>
            }
          />
        </Route>
      </Route>

      {/* ---------- administracion con navegacion global ---------- */}
      <Route element={<AdminRoute><AppLayout admin /></AdminRoute>}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/usuarios" element={<UsersPage />} />
        <Route path="/admin/usuarios/:id" element={<UserDetailPage />} />
        <Route path="/admin/noticias" element={<NewsManagementPage />} />
      </Route>
    </Routes>
  );
}

export default App;
