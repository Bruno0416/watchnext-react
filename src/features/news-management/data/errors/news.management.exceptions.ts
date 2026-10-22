// estas si llegan a la vista, ya traen el mensaje listo
export class NewsManagementException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NewsNotFoundForEditException extends NewsManagementException {
  constructor() {
    super("Esa noticia ya no existe. Puede que otro admin la haya borrado");
  }
}

export class NewsManagementUnavailableException extends NewsManagementException {
  constructor() {
    super("No pudimos guardar los cambios. Intenta mas tarde");
  }
}
