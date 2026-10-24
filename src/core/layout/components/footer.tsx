import { Link } from "react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container-fluid app-container">
        {/* ---------- contenido principal ---------- */}
        <div className="footer-content">
          {/* ---------- marca ---------- */}
          <section className="footer-brand">
            <h2>WatchNext</h2>
            <p>Descubre, califica y organiza lo que quieres ver.</p>
          </section>

          {/* ---------- navegacion ---------- */}
          <nav
            className="footer-navigation"
            aria-label="Navegación del pie de página"
          >
            <h2>Navegación</h2>

            <Link to="/inicio">Inicio</Link>

            <Link to="/mis-listas">Mis listas</Link>

            <Link to="/perfil">Perfil</Link>
          </nav>
        </div>

        {/* ---------- inferior ---------- */}
        <div className="footer-bottom">
          <p>© {currentYear} WatchNext</p>
        </div>
      </div>
    </footer>
  );
}
