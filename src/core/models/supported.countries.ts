// ---------- paises disponibles en la version local ----------
export type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
];

export const DISPLAY_NAME_MAX = 50;
export const BIO_MAX = 500;

export function isSupportedCountry(code: string): boolean {
  return COUNTRY_OPTIONS.some((country) => country.code === code.trim().toUpperCase());
}
