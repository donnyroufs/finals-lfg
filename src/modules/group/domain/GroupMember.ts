import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { GUID } from '../../../shared-kernel/ddd/GUID';
import { IEntity } from '../../../shared-kernel/ddd/IEntity';
import { Group } from './Group';
import { ORMGuid } from 'src/shared-kernel/database/types/ORMGuid';

@Entity({ tableName: 'group_members' })
export class GroupMember implements IEntity {
  @PrimaryKey({ type: ORMGuid })
  public readonly id: GUID;

  public get contestantId(): GUID {
    return this._contestantId;
  }

  // TODO: add relation
  @Property({ type: ORMGuid, name: 'contestant_id' })
  private readonly _contestantId: GUID;

  @ManyToOne(() => Group)
  public readonly group: Group;

  private constructor(contestantId: GUID, id = GUID.new()) {
    this.id = id;
    this._contestantId = contestantId;
  }

  public static create(contestantId: GUID, id?: GUID): GroupMember {
    return new GroupMember(contestantId, id);
  }
}
