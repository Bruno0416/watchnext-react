import type { AdminUser } from "../../../domain/entities/admin.user";
import { UserStatus } from "../atoms/user.status";
import { UserRow } from "../molecules/user.row";

type UsersTableProps = {
  users: AdminUser[];
  filtrando: boolean;
};

export function UsersTable({ users, filtrando }: UsersTableProps) {
  if (users.length === 0) {
    return filtrando ? (
      <UserStatus icon="search" title="Ningun usuario coincide" description="Prueba con otro texto o cambia el rol." />
    ) : (
      <UserStatus icon="people" title="Todavia no hay usuarios" />
    );
  }

  return (
    <ul className="um list" aria-label="Usuarios">
      {users.map((u) => (
        <UserRow key={u.userId} user={u} />
      ))}
    </ul>
  );
}
