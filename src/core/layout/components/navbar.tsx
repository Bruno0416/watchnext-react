import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { container } from "../../di/container";
import { useGuestAccess } from "../../router/protected.route";
import type { Logout } from "../../../features/auth/domain/usecases/logout";

// ---------- navbar global ----------

export function Navbar() {
  // ---------- estado ----------
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const isGuest = useGuestAccess();
  const navigate = useNavigate();

  // ---------- cerrar menu flotante ----------
  useEffect(() => {
    if (!accountOpen) return;

    function handleOutsideClick(event: PointerEvent): void {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

  // ---------- cierre de sesion ----------
  async function handleLogout(): Promise<void> {
    // 1. evitar solicitudes repetidas
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError(null);

    try {
      // 2. ejecutar caso de uso
      const logout = container.resolve<Logout>("logout");
      await logout.call();

      // 3. cerrar menu y redirigir
      setAccountOpen(false);
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("[ERROR] cierre de sesion", error);
      setError("No se pudo cerrar sesión.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  // ---------- renderizado ----------
  return (
    <nav
      className="navbar navbar-expand-md sticky-top border-bottom py-3"
      aria-label="Navegación principal"
      style={{
        backgroundColor: "var(--th-color-navbar)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container-fluid px-3 px-lg-5 d-flex align-items-center flex-wrap">
        {/* ---------- marca ---------- */}
        <Link
          to="/inicio"
          className="navbar-brand fw-bold fs-4 me-3"
          style={{ color: "var(--th-color-on-surface)" }}
          onClick={() => setMenuOpen(false)}
        >
          WatchNext
        </Link>

        {/* ---------- controles de cuenta ---------- */}
        <div className="d-flex align-items-center gap-2 ms-auto order-md-3">
          {isGuest ? (
            <Link
              to="/auth"
              className="btn btn-secondary rounded-pill"
              aria-label="Iniciar sesión"
            >
              <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
              <span className="d-sm-none">Entrar</span>
              <span className="d-none d-sm-inline">Iniciar sesión</span>
            </Link>
          ) : (
            <div className="dropdown" ref={accountMenuRef}>
              <button
                type="button"
                className="btn btn-secondary rounded-pill d-flex align-items-center gap-2"
                aria-label="Opciones de cuenta"
                aria-expanded={accountOpen}
                aria-controls="watchnext-account-menu"
                onClick={() => setAccountOpen(!accountOpen)}
              >
                <i className="bi bi-person-circle fs-5" aria-hidden="true" />
                <span className="d-none d-sm-inline">Mi cuenta</span>
                <i className="bi bi-chevron-down small" aria-hidden="true" />
              </button>

              {accountOpen && (
                <div
                  id="watchnext-account-menu"
                  className="dropdown-menu dropdown-menu-end show"
                >
                  <Link
                    to="/perfil"
                    className="dropdown-item py-2"
                    onClick={() => {
                      setAccountOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <i className="bi bi-person me-2" aria-hidden="true" />
                    Mi perfil
                  </Link>

                  <hr className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item py-2"
                    disabled={isLoggingOut}
                    onClick={() => void handleLogout()}
                  >
                    <i
                      className="bi bi-box-arrow-right me-2"
                      aria-hidden="true"
                    />
                    {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                  </button>

                  {error && (
                    <p
                      className="small text-danger px-3 mt-2 mb-0"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---------- menu responsive ---------- */}
          <button
            type="button"
            className="navbar-toggler border-0"
            aria-label="Alternar menú de navegación"
            aria-controls="watchnext-navbar"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i
              className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"} fs-4`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* ---------- enlaces ---------- */}
        <div
          id="watchnext-navbar"
          className={`collapse navbar-collapse order-3 order-md-2 ${
            menuOpen ? "show" : ""
          }`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-md-2">
            <li className="nav-item">
              <NavLink
                to="/inicio"
                end
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <Link
                to="/mis-listas"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Mis listas
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/perfil"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
