export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestException extends AuthException {
  constructor() {
    super("Email o contraseña mal formados");
  }
}

export class EmailAlreadyInUseException extends AuthException {
  constructor() {
    super("El email ya está registrado");
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super("Email o contraseña incorrectos");
  }
}

export class UnauthorizedException extends AuthException {
  constructor() {
    super("No autorizado");
  }
}

export class ServerException extends AuthException {
  constructor() {
    super("Error del servidor. Intenta más tarde");
  }
}

export class NetworkException extends AuthException {
  constructor() {
    super("Sin conexión. Verifica tu red");
  }
}
