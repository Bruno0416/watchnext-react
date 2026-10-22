// largos del contrato del User Service
export const DISPLAY_NAME_MAX = 40;
export const BIO_MAX = 160;

// paises que ofrezco en el select; el contrato pide ISO 3166-1 alpha-2
export const PAISES: { codigo: string; nombre: string }[] = [
  { codigo: "CL", nombre: "Chile" },
  { codigo: "AR", nombre: "Argentina" },
  { codigo: "PE", nombre: "Peru" },
  { codigo: "BO", nombre: "Bolivia" },
  { codigo: "CO", nombre: "Colombia" },
  { codigo: "MX", nombre: "Mexico" },
  { codigo: "UY", nombre: "Uruguay" },
  { codigo: "VE", nombre: "Venezuela" },
  { codigo: "ES", nombre: "España" },
  { codigo: "US", nombre: "Estados Unidos" },
  { codigo: "BR", nombre: "Brasil" },
];

export function nombrePais(codigo: string | null): string | null {
  if (!codigo) return null;
  const conocido = PAISES.find((p) => p.codigo === codigo.toUpperCase());
  if (conocido) return conocido.nombre;
  // si no lo tengo en la lista le pregunto al navegador
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(codigo.toUpperCase()) ?? codigo;
  } catch {
    return codigo;
  }
}

export function validateDisplayName(value: string): string | null {
  const v = value.trim();
  if (v.length > DISPLAY_NAME_MAX) return `Maximo ${DISPLAY_NAME_MAX} caracteres`;
  return null;
}

export function validateBio(value: string): string | null {
  if (value.trim().length > BIO_MAX) return `Maximo ${BIO_MAX} caracteres`;
  return null;
}

export function validateCountry(value: string): string | null {
  const v = value.trim().toUpperCase();
  if (!v) return "Elige un pais";
  if (!/^[A-Z]{2}$/.test(v)) return "Usa el codigo de dos letras, tipo CL";
  return null;
}

export function validateEditProfile(displayName: string, bio: string, country: string) {
  return {
    displayNameError: validateDisplayName(displayName),
    bioError: validateBio(bio),
    countryError: validateCountry(country),
  };
}
