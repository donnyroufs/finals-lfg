import { GUID } from './GUID';

export interface IDomainEvent {
  readonly id: GUID;
  readonly occuredOn: Date;
}
