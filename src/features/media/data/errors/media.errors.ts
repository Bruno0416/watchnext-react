export class MediaNotFoundError extends Error {
  constructor() {
    super("Contenido no encontrado");
    this.name = "MediaNotFoundError";
  }
}

export class MediaLoadError extends Error {
  constructor() {
    super("No se pudo cargar el contenido. Intenta nuevamente");
    this.name = "MediaLoadError";
  }
}
