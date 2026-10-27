export class OnboardingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidOnboardingDataException extends OnboardingException {
  constructor() {
    super("Los datos del perfil no son validos");
  }
}

export class UsernameAlreadyTakenException extends OnboardingException {
  constructor() {
    super("Este nombre de usuario ya esta ocupado");
  }
}

export class OnboardingUnauthorizedException extends OnboardingException {
  constructor() {
    super("Tu sesion ha expirado");
  }
}

export class OnboardingServerException extends OnboardingException {
  constructor() {
    super("Error del servidor. Intenta mas tarde");
  }
}

export class OnboardingNetworkException extends OnboardingException {
  constructor() {
    super("Sin conexion. Verifica tu red");
  }
}
