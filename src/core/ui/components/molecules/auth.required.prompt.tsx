import { Link } from "react-router";
import "./auth.required.prompt.css";

type AuthRequiredPromptProps = {
  id: "profile-guest" | "lists-guest";
  icon: "bi-person-circle" | "bi-collection-play";
  title: string;
  description: string;
};

// ---------- invitacion para usuarios invitados ----------
export function AuthRequiredPrompt({
  id,
  icon,
  title,
  description,
}: AuthRequiredPromptProps) {
  return (
    <section
      id={id}
      className={`auth-required-prompt ${id}`}
      aria-labelledby={`${id}-title`}
    >
      <i className={`bi ${icon} auth-required-prompt-icon`} aria-hidden="true" />
      <h1 id={`${id}-title`}>{title}</h1>
      <p>{description}</p>
      <Link to="/auth" className="btn btn-primary">
        <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true" />
        Iniciar sesión
      </Link>
    </section>
  );
}
