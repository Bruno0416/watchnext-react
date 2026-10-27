import { Link } from "react-router";

import "../../../../core/layout/style/static.page.css";

// ---------- informacion institucional ----------
export function AboutPage() {
  return (
    <section className="static-page" aria-labelledby="about-title">
      <header className="static-about-intro">
        <h1 id="about-title">Cada gran historia merece ser descubierta.</h1>
        <p className="static-lead">
          Encuentra películas y series, guarda tus favoritas y organiza lo que
          quieres ver. Todo en un mismo lugar.
        </p>
        <div className="static-actions">
          <Link to="/inicio" className="btn btn-primary rounded-pill">
            Explorar contenido
            <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section
        className="static-about-features"
        aria-labelledby="about-features-title"
      >
        <h2 id="about-features-title">¿Qué puedes hacer en WatchNext?</h2>
        <div className="static-about-feature-list">
          <div className="static-about-feature">
            <h3>Descubrir</h3>
            <p>Explora películas y series y consulta sus detalles.</p>
          </div>
          <div className="static-about-feature">
            <h3>Organizar</h3>
            <p>Guarda favoritos y crea listas de pendientes.</p>
          </div>
          <div className="static-about-feature">
            <h3>Compartir</h3>
            <p>Personaliza tu perfil y comparte listas públicas.</p>
          </div>
        </div>
      </section>
      <p className="static-about-team">
        WatchNext busca facilitar el descubrimiento de películas y series,
        permitiendo guardar favoritos, organizar listas y compartir
        recomendaciones. Desarrollado por Adonys Maceo y Bruno Valladares.
      </p>
    </section>
  );
}
