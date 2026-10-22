// estas si llegan a la vista, ya traen el mensaje listo
export class NewsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NewsNotFoundException extends NewsException {
  constructor() {
    super("La noticia no existe o fue eliminada");
  }
}

export class NewsUnavailableException extends NewsException {
  constructor() {
    super("No pudimos cargar las noticias. Intenta más tarde");
  }
}
