const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

// ------ helpers validacion formularios ------

export function validateLogin(email: string, password: string) {
  const cleanEmail = email.trim();
  return {
    emailError:
      cleanEmail === ""
        ? "El correo es obligatorio"
        : !EMAIL_REGEX.test(cleanEmail)
          ? "El correo no tiene un formato valido"
          : null,
    passwordError: password === "" ? "La contraseña es obligatoria" : null,
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
        : !EMAIL_REGEX.test(cleanEmail)
          ? "El correo no tiene un formato valido"
          : null,

    passwordError: password === "" ? "La contraseña es obligatoria" : null,

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
    : !EMAIL_REGEX.test(cleanEmail)
      ? "El correo no tiene un formato valido"
      : null;
}

export function validatePassword(password: string) {
  return password === "" ? "La contraseña es obligatoria" : null;
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
