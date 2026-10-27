// error pelado con el status, como lo devolveria el backend
export class UserManagementError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "UserManagementError";
    this.status = status;
  }
}
