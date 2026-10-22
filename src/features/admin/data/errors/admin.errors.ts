// error pelado con el status, como lo devolveria el backend
export class AdminError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "AdminError";
    this.status = status;
  }
}
