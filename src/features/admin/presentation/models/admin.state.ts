import type { AdminSummary } from "../../domain/entities/admin.summary";

export type AdminState = {
  summary: AdminSummary | null;
  isLoading: boolean;
  error: string | null;
};

export const initialAdminState: AdminState = {
  summary: null,
  isLoading: true,
  error: null,
};

// cada acceso del panel; si mañana hay otra seccion la agrego aca
export type AdminSection = {
  to: string;
  icon: string;
  title: string;
  description: string;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    to: "/admin/usuarios",
    icon: "people-fill",
    title: "Usuarios",
    description: "Consulta cuentas, crea usuarios y corrige nombres de perfil.",
  },
  {
    to: "/admin/noticias",
    icon: "newspaper",
    title: "Noticias",
    description: "Crea, edita y elimina las noticias publicadas.",
  },
];
