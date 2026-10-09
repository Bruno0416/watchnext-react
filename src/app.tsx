import { Route, Routes } from "react-router";
import { AuthPage } from "./features/auth/presentation/pages/auth.page";
import { RegisterPage } from "./features/auth/presentation/pages/register.page";
import { LoginPage } from "./features/auth/presentation/pages/login.page";
import { RootRedirect } from "./core/router/root.redirect";
import { AdminRoute } from "./core/router/admin.route";

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
