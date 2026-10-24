import { useGuestAccess } from "../../../../core/router/protected.route";
import { AuthRequiredPrompt } from "../../../../core/ui/components/molecules/auth.required.prompt";

// ---------- pagina de perfil ----------
export function ProfilePage() {
  const isGuest = useGuestAccess();

  return (
    <section id="profile-view" className="profile-view guest-feature-view">
      <div className="container-fluid app-container">
        {isGuest ? (
          <AuthRequiredPrompt
            id="profile-guest"
            icon="bi-person-circle"
            title="Tu perfil te espera"
            description="Inicia sesión para ver y personalizar tu perfil de WatchNext."
          />
        ) : (
          <section id="profile-content" className="container py-5">
            <h1 className="h3">Mi perfil</h1>
            <p className="text-body-secondary">
              Página de perfil pendiente de implementar.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
