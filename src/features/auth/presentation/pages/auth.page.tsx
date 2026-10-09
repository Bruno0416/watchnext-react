import { useNavigate } from "react-router";

import { Button } from "../components/atoms/button";
import "./auth.page.css";

export function AuthPage() {
  const navigate = useNavigate();

  return (
    <main className="auth page welcome">
      <section className="auth content">
        <h2 className="auth title">Bienvenido a WatchNext</h2>

        <p className="auth description">
          Sigue, califica y descubre tu próxima película o serie favorita.
        </p>

        <div className="auth actions">
          <Button onClick={() => navigate("/auth/iniciar-sesion")}>
            Iniciar sesión
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/auth/registrarse")}
          >
            Registrarse
          </Button>

          <Button
            variant="link"
            className="auth guest"
            onClick={() => navigate("/inicio")}
          >
            Saltar por ahora
          </Button>
        </div>
      </section>
    </main>
  );
}
