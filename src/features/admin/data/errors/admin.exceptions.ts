// la que llega a la vista con el mensaje listo
export class AdminException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class AdminSummaryUnavailableException extends AdminException {
  constructor() {
    super("No pudimos cargar el resumen. Los accesos igual funcionan");
  }
}
