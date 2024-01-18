import { GroupMatchingService } from 'src/modules/group/domain/GroupMatchingService';
import { TestContestantBuilder } from '../utils/TestContestantBuilder';
import { Group } from 'src/modules/group/domain/Group';
import { TestGroupMemberBuilder } from '../utils/TestGroupMemberBuilder';
import { GUID } from 'src/shared-kernel/ddd/GUID';

const { aContestant } = TestContestantBuilder;
const { aGroupMember } = TestGroupMemberBuilder;

describe('GroupMatchingService', () => {
  const CURRENT_DATE = new Date();

  test('returns null when there are no contestants', () => {
    const contestant = aContestant().build();
    const result = GroupMatchingService.findMatch(contestant, [], CURRENT_DATE);

    expect(result).toBe(null);
  });

  test('returns null when there are not enough contestants', () => {
    const contestant1 = aContestant().build();
    const contestant2 = aContestant().build();
    const result = GroupMatchingService.findMatch(
      contestant1,
      [contestant2],
      CURRENT_DATE,
    );

    expect(result).toBe(null);
  });

  test('returns a group when three matching contestants have been found', () => {
    const contestant1 = aContestant().build();
    const contestant2 = aContestant().build();
    const contestant3 = aContestant().build();
    const result = GroupMatchingService.findMatch(
      contestant1,
      [contestant2, contestant3],
      CURRENT_DATE,
    );

    const expectedGroup = Group.create(
      [
        aGroupMember().withContestantId(contestant1.id.value).build(),
        aGroupMember().withContestantId(contestant2.id.value).build(),
        aGroupMember().withContestantId(contestant3.id.value).build(),
      ],
      expect.any(GUID),
    );

    expect(result!.members).toEqual(
      expect.arrayContaining(expectedGroup.members),
    );
  });

  test('excludes the contestant whom we are trying to find a group for', () => {
    const contestant1 = aContestant().build();
    const contestant2 = aContestant().build();
    const contestant3 = aContestant().build();

    const result = GroupMatchingService.findMatch(
      contestant1,
      [contestant1, contestant2, contestant3],
      CURRENT_DATE,
    );

    const expectedGroup = Group.create(
      [
        aGroupMember().withContestantId(contestant1.id.value).build(),
        aGroupMember().withContestantId(contestant2.id.value).build(),
        aGroupMember().withContestantId(contestant3.id.value).build(),
      ],
      expect.any(GUID),
    );
    expect(result!.members).toEqual(
      expect.arrayContaining(expectedGroup.members),
    );
  });
});
