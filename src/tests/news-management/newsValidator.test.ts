import { expect, test } from "vitest";

import {
  TITLE_MAX,
  hayErrores,
  validateImageUrl,
  validateNewsDraft,
  validateTitle,
} from "../../features/news-management/presentation/validators/news.validator";

test("HU14: el titulo es obligatorio y tiene largo minimo y maximo", () => {
  expect(validateTitle("")).toBe("El titulo es obligatorio");
  expect(validateTitle("Hola")).toBe("Minimo 5 caracteres");
  expect(validateTitle("a".repeat(TITLE_MAX + 1))).toBe(`Maximo ${TITLE_MAX} caracteres`);
  expect(validateTitle("Estrenos de noviembre")).toBe(null);
});

test("HU14: la imagen es opcional pero si viene debe ser url http(s)", () => {
  expect(validateImageUrl("")).toBe(null);
  expect(validateImageUrl("no-es-url")).toBe("Eso no parece una url valida");
  expect(validateImageUrl("ftp://algo.cl/a.png")).toBe("La imagen debe ser una url http o https");
  expect(validateImageUrl("https://watchnext.cl/a.png")).toBe(null);
});

test("HU14: un borrador vacio tiene errores y uno completo no", () => {
  const vacio = validateNewsDraft({ title: "", summary: "", content: "", imageUrl: "" });
  expect(hayErrores(vacio)).toBe(true);

  const completo = validateNewsDraft({
    title: "Estrenos de noviembre",
    summary: "Lo que llega este mes al catalogo.",
    content: "Este mes sumamos varios titulos nuevos para tus listas.",
    imageUrl: "",
  });
  expect(hayErrores(completo)).toBe(false);
});
