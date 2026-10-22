import { Route, Routes } from "react-router";
import { AuthPage } from "./features/auth/presentation/pages/auth.page";
import { RegisterPage } from "./features/auth/presentation/pages/register.page";
import { LoginPage } from "./features/auth/presentation/pages/login.page";
import { RootRedirect } from "./core/router/root.redirect";
import { AdminRoute } from "./core/router/admin.route";
import { NewsPage } from "./features/news/presentation/pages/news.page";
import { NewsDetailPage } from "./features/news/presentation/pages/news.detail.page";
import { UserRoute } from "./core/router/user.route";
import { ListsPage } from "./features/lists/presentation/pages/lists.page";
import { ListDetailPage } from "./features/lists/presentation/pages/list.detail.page";
import { ProfilePage } from "./features/profile/presentation/pages/profile.page";
import { NewsManagementPage } from "./features/news-management/presentation/pages/news.management.page";

// ------- rutas de la aplicacion -------
function App() {
  return (
    <>
      {/* <Navbar/>*/}

      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/iniciar-sesion" element={<LoginPage />} />
        <Route path="/auth/registrarse" element={<RegisterPage />} />

        <Route path="/inicio" element={<main>Home</main>} />

        <Route path="/noticias" element={<NewsPage />} />
        <Route path="/noticias/:id" element={<NewsDetailPage />} />

        <Route
          path="/listas"
          element={
            <UserRoute>
              <ListsPage />
            </UserRoute>
          }
        />
        <Route
          path="/listas/:id"
          element={
            <UserRoute>
              <ListDetailPage />
            </UserRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <UserRoute>
              <ProfilePage />
            </UserRoute>
          }
        />
        <Route path="/perfil/:username" element={<ProfilePage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <main>Admin</main>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/noticias"
          element={
            <AdminRoute>
              <NewsManagementPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
