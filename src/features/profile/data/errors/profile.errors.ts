// error pelado con el status, imito lo que va a devolver el backend real
export class ProfileError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "ProfileError";
    this.status = status;
  }
}
