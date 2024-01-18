import { Group } from 'src/modules/group/domain/Group';
import { IBuilder } from './IBuilder';
import { GroupMember } from 'src/modules/group/domain/GroupMember';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class TestGroupBuilder implements IBuilder<Group> {
  private _members: GroupMember[] = [];
  private _id: GUID;

  public build(): Group {
    return Group.create(this._members, this._id ?? GUID.new());
  }

  public static aGroup(): TestGroupBuilder {
    return new TestGroupBuilder();
  }
}
