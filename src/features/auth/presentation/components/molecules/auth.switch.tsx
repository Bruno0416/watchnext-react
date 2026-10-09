import { TextLink } from "../atoms/text.link";

type AuthSwitchType = "login" | "register";

type AuthSwitchProps = {
  type: AuthSwitchType;
};

export function AuthSwitch({ type }: AuthSwitchProps) {
  if (type === "login") {
    return (
      <div className="auth switch">
        <span>¿No tienes una cuenta?</span>

        <TextLink to="/auth/registrarse">Registrarse</TextLink>
      </div>
    );
  }

  return (
    <div className="auth switch">
      <span>¿Ya tienes una cuenta?</span>

      <TextLink to="/auth/iniciar-sesion">Iniciar sesión</TextLink>
    </div>
  );
}
