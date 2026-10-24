export class HomeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidHomeDataException extends HomeException {
  constructor() {
    super("No se pudieron interpretar los datos del catalogo");
  }
}

export class ServerException extends HomeException {
  constructor() {
    super("Error del servidor. Intenta mas tarde");
  }
}

export class NetworkException extends HomeException {
  constructor() {
    super("Sin conexion. Verifica tu red");
  }
}
