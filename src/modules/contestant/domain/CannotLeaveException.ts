export class CannotLeaveException extends Error {
  public constructor() {
    super('You have not yet joined therefore you cannot "leave".');
  }
}
