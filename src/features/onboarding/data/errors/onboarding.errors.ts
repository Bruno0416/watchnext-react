export class OnboardingError extends Error {
  readonly status: number;

  constructor(status: number, message = "") {
    super(message);
    this.name = "OnboardingError";
    this.status = status;
  }
}
