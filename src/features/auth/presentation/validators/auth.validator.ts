const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const EMAIL_MAX_LENGTH = 100;

// ---------- validacion de formularios ----------
export function validateLogin(email: string, password: string) {
  const cleanEmail = email.trim();
  return {
    emailError: validateEmail(cleanEmail),
    passwordError: validatePassword(password),
  };
}

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string,
) {
  const cleanEmail = email.trim();

  return {
    emailError: validateEmail(cleanEmail),
    passwordError: validatePassword(password),
    confirmPasswordError: validateConfirmPassword(password, confirmPassword),
  };
}

// ---------- validacion de campos ----------
export function validateEmail(email: string) {
  const cleanEmail = email.trim();
  return cleanEmail === ""
    ? "El correo es obligatorio"
    : cleanEmail.length > EMAIL_MAX_LENGTH
      ? "El correo no puede superar 100 caracteres"
      : !EMAIL_REGEX.test(cleanEmail)
        ? "El correo no tiene un formato valido"
        : null;
}

export function validatePassword(password: string) {
  return password === ""
    ? "La contraseña es obligatoria"
    : password.length < 8 || password.length > 60
      ? "La contraseña debe tener entre 8 y 60 caracteres"
      : null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
) {
  return confirmPassword === ""
    ? "Confirma tu contraseña"
    : password !== confirmPassword
      ? "Las contraseñas no coinciden"
      : null;
}

export function validateCode(code: string) {
  return code === "" ? "El código es obligatorio" : null;
}

export function validateNewPassword(password: string) {
  return password === ""
    ? "La contraseña es obligatoria"
    : password.length < 8
      ? "La contraseña debe tener al menos 8 caracteres"
      : null;
}

export function validateLoginPassword(password: string): string | null {
  return password === "" ? "La contraseña es obligatoria" : null;
}
