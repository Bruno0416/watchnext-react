// las que llegan a la vista con el mensaje listo
export class UserManagementException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class AdminUserNotFoundException extends UserManagementException {
  constructor() {
    super("No encontramos ese usuario");
  }
}

export class UserManagementUnavailableException extends UserManagementException {
  constructor() {
    super("No pudimos cargar los usuarios. Intenta mas tarde");
  }
}
