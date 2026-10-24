import { useGuestAccess } from "../../../../core/router/protected.route";
import { AuthRequiredPrompt } from "../../../../core/ui/components/molecules/auth.required.prompt";

// ---------- pagina de listas ----------
export function ListsPage() {
  const isGuest = useGuestAccess();

  return (
    <section id="lists-view" className="lists-view guest-feature-view">
      <div className="container-fluid app-container">
        {isGuest ? (
          <AuthRequiredPrompt
            id="lists-guest"
            icon="bi-collection-play"
            title="Tus listas te esperan"
            description="Inicia sesión para crear listas, guardar películas y series y retomarlas cuando quieras."
          />
        ) : (
          <section id="lists-content" className="container py-5">
            <h1 className="h3">Mis listas</h1>
            <p className="text-body-secondary">
              Página de listas pendiente de implementar.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
