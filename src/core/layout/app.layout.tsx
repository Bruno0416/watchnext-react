import { Outlet } from "react-router";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

// ---------- layout de paginas protegidas (con navbar y footer) ----------
export function AppLayout() {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Navbar />

      <main id="main-content" className="app-layout-main grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
