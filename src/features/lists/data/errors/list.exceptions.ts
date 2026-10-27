// estas si llegan a la vista, ya traen el mensaje listo
export class ListException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ListNotFoundException extends ListException {
  constructor() {
    super("La lista no existe o fue eliminada");
  }
}

export class ListItemAlreadyExistsException extends ListException {
  constructor() {
    super("Ese contenido ya esta en la lista");
  }
}

export class ListUnavailableException extends ListException {
  constructor() {
    super("No pudimos cargar tus listas. Intenta mas tarde");
  }
}

export class ListAuthenticationRequiredException extends ListException {
  constructor() {
    super("Inicia sesion para acceder a tus listas");
  }
}

export class ListAccessDeniedException extends ListException {
  constructor() {
    super("Esta lista no esta disponible");
  }
}
