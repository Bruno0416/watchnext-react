// largos que acepta el List Service, los dejo aca para no repetirlos
export const LIST_NAME_MIN = 2;
export const LIST_NAME_MAX = 50;
export const LIST_DESCRIPTION_MAX = 200;

export function validateListName(name: string): string | null {
  const value = name.trim();

  if (!value) return "Ponle un nombre a la lista";
  if (value.length < LIST_NAME_MIN) return `Minimo ${LIST_NAME_MIN} caracteres`;
  if (value.length > LIST_NAME_MAX) return `Maximo ${LIST_NAME_MAX} caracteres`;

  return null;
}

export function validateListDescription(description: string): string | null {
  if (description.trim().length > LIST_DESCRIPTION_MAX) {
    return `Maximo ${LIST_DESCRIPTION_MAX} caracteres`;
  }

  return null;
}

export function validateCreateList(
  name: string,
  description: string,
): { nameError: string | null; descriptionError: string | null } {
  return {
    nameError: validateListName(name),
    descriptionError: validateListDescription(description),
  };
}
