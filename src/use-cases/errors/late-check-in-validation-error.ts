export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only be late up to 20 minutes.')
  }
}
