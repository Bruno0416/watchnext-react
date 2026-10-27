import { Outlet } from "react-router";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

// ---------- layout de paginas protegidas (con navbar y footer) ----------
export function AppLayout({ admin = false }: { admin?: boolean }) {
  return (
    <div className="app-layout">
      <Navbar admin={admin} />

      <main id="main-content" className="app-layout-main">
        <Outlet />
      </main>

      <Footer admin={admin} />
    </div>
  );
}
