export class AlreadyJoinedException extends Error {
  public constructor() {
    super('You have already joined.');
  }
}
