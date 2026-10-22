// estas si llegan a la vista, ya traen el mensaje listo
export class ProfileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ProfileNotFoundException extends ProfileException {
  constructor() {
    super("Ese perfil no existe");
  }
}

export class ProfileUnauthenticatedException extends ProfileException {
  constructor() {
    super("Tienes que iniciar sesion para ver tu perfil");
  }
}

export class ProfileUnavailableException extends ProfileException {
  constructor() {
    super("No pudimos cargar el perfil. Intenta mas tarde");
  }
}
