// error pelado con el status, imito lo que va a devolver el backend real
export class NewsManagementError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "NewsManagementError";
    this.status = status;
  }
}
