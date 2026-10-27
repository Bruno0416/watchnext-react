import { BIO_MAX, DISPLAY_NAME_MAX, isSupportedCountry } from "../../../../core/models/supported.countries";

// ----- validar país -----
export function validateCountry(country: string): string | null {
  if (!country.trim()) {
    return "Selecciona un país";
  }

  if (!/^[A-Za-z]{2}$/.test(country)) {
    return "El país debe usar un código ISO de 2 letras";
  }

  if (!isSupportedCountry(country)) {
    return "Selecciona Chile, Argentina o Brasil";
  }

  return null;
}

// ----- validar nombre de usuario -----
export function validateUsername(username: string): string | null {
  const value = username.trim();

  if (!value) {
    return "El nombre de usuario es obligatorio";
  }

  if (!/^[a-z0-9_]{3,30}$/.test(value)) {
    return "Usa entre 3 y 30 letras minúsculas, números o guion bajo";
  }

  return null;
}

// ----- validar display name -----
export function validateDisplayName(displayName: string): string | null {
  if (displayName.length > DISPLAY_NAME_MAX) {
    return `El nombre no puede exceder ${DISPLAY_NAME_MAX} caracteres`;
  }

  return null;
}

// ----- validar biografía -----
export function validateBio(bio: string): string | null {
  if (bio.length > BIO_MAX) {
    return `La descripción no puede exceder ${BIO_MAX} caracteres`;
  }

  return null;
}

// ----- validar favoritos -----
export function validateFavorites(count: number): string | null {
  if (count > 5) {
    return "Solo puedes seleccionar un máximo de 5 favoritos";
  }

  return null;
}
