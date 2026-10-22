import { expect, test } from "vitest";

import {
  BIO_MAX,
  nombrePais,
  validateBio,
  validateCountry,
} from "../../features/profile/presentation/validators/profile.validator";

test("HU10: la bio no puede pasar del maximo", () => {
  expect(validateBio("a".repeat(BIO_MAX + 1))).not.toBe(null);
  expect(validateBio("Me gustan las series")).toBe(null);
});

test("HU10: el pais es obligatorio y va como codigo de dos letras", () => {
  expect(validateCountry("CL")).toBe(null);
  expect(validateCountry("")).toBe("Elige un pais");
  expect(validateCountry("Chile")).toBe("Usa el codigo de dos letras, tipo CL");
  expect(nombrePais("CL")).toBe("Chile");
});
