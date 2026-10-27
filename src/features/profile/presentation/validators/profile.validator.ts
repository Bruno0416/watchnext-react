import {
  BIO_MAX,
  COUNTRY_OPTIONS,
  DISPLAY_NAME_MAX,
  isSupportedCountry,
} from "../../../../core/models/supported.countries";

export { BIO_MAX, DISPLAY_NAME_MAX };

// ---------- nombres de paises compatibles con datos existentes ----------
export function nombrePais(codigo: string | null): string | null {
  if (!codigo) return null;
  const conocido = COUNTRY_OPTIONS.find((p) => p.code === codigo.toUpperCase());
  if (conocido) return conocido.name;
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(codigo.toUpperCase()) ?? codigo;
  } catch {
    return codigo;
  }
}

// ---------- validaciones coherentes con onboarding ----------
export function validateDisplayName(value: string): string | null {
  if (value.length > DISPLAY_NAME_MAX) return `Máximo ${DISPLAY_NAME_MAX} caracteres`;
  return null;
}

export function validateBio(value: string): string | null {
  if (value.length > BIO_MAX) return `Máximo ${BIO_MAX} caracteres`;
  return null;
}

export function validateCountry(value: string): string | null {
  const country = value.trim().toUpperCase();
  if (!country) return "Elige un pais";
  if (!/^[A-Z]{2}$/.test(country)) return "Usa el codigo de dos letras, tipo CL";
  if (!isSupportedCountry(country)) return "Selecciona Chile, Argentina o Brasil";
  return null;
}

export function validateEditProfile(displayName: string, bio: string, country: string) {
  return {
    displayNameError: validateDisplayName(displayName),
    bioError: validateBio(bio),
    countryError: validateCountry(country),
  };
}
