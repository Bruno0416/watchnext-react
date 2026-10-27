export class ListServiceError extends Error {
  constructor(public readonly status: number) {
    super(`Error de listas: ${status}`);
    this.name = "ListServiceError";
  }
}
