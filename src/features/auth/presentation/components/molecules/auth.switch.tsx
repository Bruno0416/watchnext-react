import { TextLink } from "../atoms/text.link";

type AuthSwitchType = "login" | "register";

type AuthSwitchProps = {
  type: AuthSwitchType;
  onSwitch?: () => void;
};

export function AuthSwitch({ type, onSwitch }: AuthSwitchProps) {
  if (type === "login") {
    return (
      <div className="auth switch">
        <span>¿No tienes una cuenta?</span>

        <TextLink
          to={onSwitch ? undefined : "/auth/registrarse"}
          onClick={onSwitch}
        >
          Registrarse
        </TextLink>
      </div>
    );
  }

  return (
    <div className="auth switch">
      <span>¿Ya tienes una cuenta?</span>

      <TextLink
        to={onSwitch ? undefined : "/auth/iniciar-sesion"}
        onClick={onSwitch}
      >
        Iniciar sesión
      </TextLink>
    </div>
  );
}
