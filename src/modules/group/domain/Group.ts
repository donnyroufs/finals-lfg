import { Cascade, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { GroupMember } from './GroupMember';
import { GUID } from '../../../shared-kernel/ddd/GUID';
import { AggregateRoot } from '../../../shared-kernel/ddd/AggregateRoot';
import { GroupCreatedEvent } from './GroupCreatedEvent';
import { ORMGuid } from 'src/shared-kernel/database/types/ORMGuid';

@Entity()
export class Group extends AggregateRoot {
  public static SIZE = 3;

  @PrimaryKey({ type: ORMGuid })
  public readonly id: GUID;

  public get members(): GroupMember[] {
    return this._members;
  }

  @OneToMany(() => GroupMember, (member) => member.group, {
    eager: true,
    cascade: [Cascade.ALL],
  })
  private readonly _members: GroupMember[] = [];

  private constructor(members: GroupMember[], id = GUID.new()) {
    super(id);
    if (members.length !== Group.SIZE) {
      throw new Error('A group must contain three members');
    }

    this._members = members;
  }

  public static create(members: GroupMember[], id?: GUID): Group {
    return new Group(members, id);
  }

  public static new(members: GroupMember[], date: Date): Group {
    const group = new Group(members);
    group.apply(
      new GroupCreatedEvent(
        members.map((member) => member.id),
        group.id,
        date,
      ),
    );
    return group;
  }
}
