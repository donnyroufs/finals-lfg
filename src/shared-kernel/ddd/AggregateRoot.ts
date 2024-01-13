import { OnLoad, Property } from '@mikro-orm/core';
import { GUID } from './GUID';
import { IDomainEvent } from './IDomainEvent';
import { IEntity } from './IEntity';

export abstract class AggregateRoot implements IEntity {
  @Property({ persist: false })
  private _events = new Set<IDomainEvent>();

  public constructor(public readonly id: GUID) {}

  public commit(): void {
    this._events.clear();
  }

  public apply(evt: IDomainEvent): void {
    this._events.add(evt);
  }

  public getDomainEvents(): IDomainEvent[] {
    return Array.from(this._events.values());
  }

  @OnLoad()
  private onLoad(): void {
    this._events = new Set<IDomainEvent>();
  }
}
