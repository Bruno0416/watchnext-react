export class HomeError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "HomeError";
    this.status = status;
  }
}
