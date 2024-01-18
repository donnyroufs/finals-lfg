import { GroupMember } from 'src/modules/group/domain/GroupMember';
import { IBuilder } from './IBuilder';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class TestGroupMemberBuilder implements IBuilder<GroupMember> {
  private _contestantId: GUID;
  private _id: GUID;

  public withContestantId(value: string): this {
    this._contestantId = GUID.from(value);
    return this;
  }

  public withAnyId(): this {
    this._id = expect.any(GUID);
    return this;
  }

  public build(): GroupMember {
    return GroupMember.create(
      this._contestantId ?? GUID.new(),
      this._id ?? GUID.new(),
    );
  }

  public static aGroupMember(): TestGroupMemberBuilder {
    return new TestGroupMemberBuilder().withAnyId();
  }
}
