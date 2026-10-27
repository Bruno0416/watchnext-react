import { Link } from "react-router";

export function Footer({ admin = false }: { admin?: boolean }) {
  const currentYear = new Date().getFullYear();
  const links = admin
    ? [
        { to: "/admin", label: "Resumen" },
        { to: "/admin/usuarios", label: "Usuarios" },
        { to: "/admin/noticias", label: "Noticias" },
      ]
    : [
        { to: "/inicio", label: "Inicio" },
        { to: "/noticias", label: "Noticias" },
        { to: "/mis-listas", label: "Mis listas" },
        { to: "/perfil", label: "Perfil" },
        { to: "/sobre-nosotros", label: "Sobre nosotros" },
        { to: "/contacto", label: "Contacto" },
      ];

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

            {links.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
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
