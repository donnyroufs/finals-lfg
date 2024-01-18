import { Group } from 'src/modules/group/domain/Group';
import { TestGroupMemberBuilder } from '../utils/TestGroupMemberBuilder';
import { GroupMember } from 'src/modules/group/domain/GroupMember';
import { GroupCreatedEvent } from 'src/modules/group/domain/GroupCreatedEvent';

const { aGroupMember } = TestGroupMemberBuilder;

describe('Group', () => {
  test('A group cannot be empty', () => {
    const act = (): Group => Group.create([]);

    expect(act).toThrow();
  });

  test.each([
    [[aGroupMember().build(), aGroupMember().build()]],
    [[aGroupMember().build()]],
    [
      [
        aGroupMember().build(),
        aGroupMember().build(),
        aGroupMember().build(),
        aGroupMember().build(),
      ],
    ],
  ])('A group cannot be less or more than three members', (members) => {
    const act = (): Group => Group.create(members);
    expect(act).toThrow();
  });

  test('Applies a NewGroupCreatedEvent', () => {
    const member1 = aGroupMember().build();
    const member2 = aGroupMember().build();
    const member3 = aGroupMember().build();
    const date = new Date();

    const group = Group.new([member1, member2, member3], date);

    expect(group.getDomainEvents()).toEqual([
      new GroupCreatedEvent(
        [member1.id, member2.id, member3.id],
        group.id,
        date,
      ),
    ]);
  });
});
