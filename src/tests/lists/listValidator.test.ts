import { expect, test } from "vitest";

import {
  LIST_NAME_MAX,
  validateCreateList,
  validateListName,
} from "../../features/lists/presentation/validators/list.validator";

test("HU12: el nombre de la lista es obligatorio", () => {
  // Solo espacios cuenta como vacio
  expect(validateListName("   ")).toBe("Ponle un nombre a la lista");
});

test("HU12: el nombre no puede pasar del maximo", () => {
  const largo = "a".repeat(LIST_NAME_MAX + 1);
  expect(validateListName(largo)).toBe(`Maximo ${LIST_NAME_MAX} caracteres`);
});

test("HU12: un nombre y descripcion validos no tienen errores", () => {
  const errores = validateCreateList("Para el finde", "Peliculas cortas");
  expect(errores.nameError).toBe(null);
  expect(errores.descriptionError).toBe(null);
});
