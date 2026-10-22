import { expect, test } from "vitest";

import { AdminSummaryModel } from "../../features/admin/data/models/admin.summary.model";

test("HU16: cuenta usuarios, admins, onboarding pendiente y noticias", () => {
  const usuarios = [
    { role: "ADMIN", onboardingCompleted: true },
    { role: "USER", onboardingCompleted: true },
    { role: "USER", onboardingCompleted: false },
  ];
  const noticias = [{ publishedAt: "2026-10-01T10:00:00Z" }, { publishedAt: "2026-10-03T10:00:00Z" }];

  const r = new AdminSummaryModel(usuarios, noticias).toDomain();

  expect(r.totalUsers).toBe(3);
  expect(r.admins).toBe(1);
  expect(r.pendingOnboarding).toBe(1);
  expect(r.totalNews).toBe(2);
  // la ultima es la mas nueva
  expect(r.lastNewsAt?.toISOString()).toBe("2026-10-03T10:00:00.000Z");
});

test("HU16: sin noticias la ultima fecha queda en null", () => {
  const r = new AdminSummaryModel([], []).toDomain();
  expect(r.lastNewsAt).toBe(null);
});
