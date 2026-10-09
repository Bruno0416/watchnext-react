export class AuthError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
