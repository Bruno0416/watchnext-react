// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { RelationshipStatus } from "../../features/profile/domain/entities/relationship";
import { FollowButton } from "../../features/profile/presentation/components/molecules/follow.button";
import { initialRelationshipState, type RelationshipState } from "../../features/profile/presentation/models/follow.state";

afterEach(() => cleanup());

// arma el estado del boton con lo que necesite cada prueba
function estado(status: RelationshipStatus, extra: Partial<RelationshipState> = {}): RelationshipState {
  return {
    ...initialRelationshipState,
    isLoading: false,
    canFollow: true,
    relationship: { status, followsYou: false },
    ...extra,
  };
}

test("HU11: el texto del boton cambia segun la relacion", () => {
  // Sin relacion dice Seguir
  const { rerender } = render(<FollowButton state={estado(RelationshipStatus.NONE)} onToggle={() => {}} />);
  expect(screen.getByRole("button").textContent?.trim()).toBe("Seguir");

  // Perfil privado: queda como solicitud
  rerender(<FollowButton state={estado(RelationshipStatus.REQUESTED)} onToggle={() => {}} />);
  expect(screen.getByRole("button").textContent?.trim()).toBe("Solicitud enviada");

  // Ya lo sigo
  rerender(<FollowButton state={estado(RelationshipStatus.FOLLOWING)} onToggle={() => {}} />);
  expect(screen.getByRole("button").textContent?.trim()).toBe("Siguiendo");
});

test("HU11: al hacer click avisa con onToggle", () => {
  // Simulamos la funcion que recibe el boton
  const onToggle = vi.fn();
  render(<FollowButton state={estado(RelationshipStatus.NONE)} onToggle={onToggle} />);

  // Simulamos que el usuario presiona Seguir
  fireEvent.click(screen.getByRole("button", { name: "Seguir" }));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

test("HU11: sin sesion no se muestra el boton", () => {
  render(<FollowButton state={estado(RelationshipStatus.NONE, { canFollow: false })} onToggle={() => {}} />);
  expect(screen.queryByRole("button")).toBe(null);
});

test("HU11: muestra 'Te sigue' cuando el otro me sigue", () => {
  const s = estado(RelationshipStatus.NONE);
  render(<FollowButton state={{ ...s, relationship: { ...s.relationship, followsYou: true } }} onToggle={() => {}} />);
  expect(screen.getByText("Te sigue")).toBeTruthy();
});
