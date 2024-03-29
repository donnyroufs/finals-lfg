import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { GUID } from '../../../shared-kernel/ddd/GUID';
import { AggregateRoot } from '../../../shared-kernel/ddd/AggregateRoot';
import { AlreadyJoinedException } from './AlreadyJoinedException';
import { ContestantJoinedEvent } from './ContestantJoinedEvent';
import { CannotLeaveException } from './CannotLeaveException';
import { ORMGuid } from 'src/shared-kernel/database/types/ORMGuid';

@Entity({ tableName: 'contestants' })
export class Contestant extends AggregateRoot {
  @PrimaryKey({ type: ORMGuid })
  public readonly id: GUID;

  public get joined(): boolean {
    return this._joined;
  }

  public get userId(): string {
    return this._userId;
  }

  @Property({ columnType: 'boolean', name: 'joined' })
  private _joined: boolean;

  @Property({
    columnType: 'varchar',
    name: 'userId',
    unique: true,
  })
  private _userId: string;

  private constructor(joined: boolean, userId: string, id: GUID) {
    super(id);

    this._joined = joined;
    this._userId = userId;
  }

  public join(date: Date): void {
    if (this.joined) {
      throw new AlreadyJoinedException();
    }

    this._joined = true;

    this.apply(new ContestantJoinedEvent(this.id, date));
  }

  public leave(): void {
    if (!this._joined) {
      throw new CannotLeaveException();
    }

    this._joined = false;
  }

  public foundGroup(): void {
    this._joined = false;
  }

  public static create(
    joined: boolean,
    userId: string,
    id: GUID = GUID.new(),
  ): Contestant {
    return new Contestant(joined, userId, id);
  }
}
