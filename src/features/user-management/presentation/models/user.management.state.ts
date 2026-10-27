import type { AdminUser } from "../../domain/entities/admin.user";

export type RoleFilter = "ALL" | "ADMIN" | "USER";

// lista de usuarios del admin
export type UserListState = {
  users: AdminUser[];
  query: string;
  role: RoleFilter;
  isLoading: boolean;
  error: string | null;
};

export const initialUserListState: UserListState = {
  users: [],
  query: "",
  role: "ALL",
  isLoading: true,
  error: null,
};

// detalle de un usuario
export type UserDetailState = {
  user: AdminUser | null;
  isLoading: boolean;
  notFound: boolean;
  error: string | null;
};

export const initialUserDetailState: UserDetailState = {
  user: null,
  isLoading: true,
  notFound: false,
  error: null,
};
