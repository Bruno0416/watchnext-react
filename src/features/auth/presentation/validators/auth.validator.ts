const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const EMAIL_MAX_LENGTH = 100;

// ------ helpers validacion formularios ------
export function validateLogin(email: string, password: string) {
  const cleanEmail = email.trim();
  return {
    emailError:
      cleanEmail === ""
        ? "El correo es obligatorio"
        : cleanEmail.length > EMAIL_MAX_LENGTH
          ? "El correo no puede superar 100 caracteres"
        : !EMAIL_REGEX.test(cleanEmail)
          ? "El correo no tiene un formato valido"
          : null,
    passwordError:
      password === ""
        ? "La contraseña es obligatoria"
        : password.length < 6 || password.length > 10
          ? "La contraseña debe tener al menos 6 caracteres y como máximo 10"
          : null,
  };
}

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string,
) {
  const cleanEmail = email.trim();

  return {
    emailError:
      cleanEmail === ""
        ? "El correo es obligatorio"
        : cleanEmail.length > EMAIL_MAX_LENGTH
          ? "El correo no puede superar 100 caracteres"
        : !EMAIL_REGEX.test(cleanEmail)
          ? "El correo no tiene un formato valido"
          : null,

    passwordError:
      password === ""
        ? "La contraseña es obligatoria"
        : password.length < 6 || password.length > 10
          ? "La contraseña debe tener al menos 6 caracteres y como máximo 10"
          : null,

    confirmPasswordError:
      confirmPassword === ""
        ? "Confirma tu contraseña"
        : password !== confirmPassword
          ? "Las contraseñas no coinciden"
          : null,
  };
}

// -------------------- helpers validacion campos --------------------
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
    : password.length < 6 || password.length > 10
      ? "La contraseña debe tener al menos 6 caracteres y como máximo 10"
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
    : password.length < 6 || password.length > 10
      ? "La contraseña debe tener al menos 6 caracteres y como máximo 10"
      : null;
}
