import { Contestant } from '../../../modules/contestant/domain/Contestant';
import { Group } from './Group';
import { GroupMember } from './GroupMember';

type MatchResult = Group | null;

export class GroupMatchingService {
  public static findMatch(
    contestant: Contestant,
    contestants: Contestant[],
    currentDate: Date,
  ): MatchResult {
    const potentialMatch = contestants
      .filter((c) => c.id !== contestant.id)
      .slice(0, 2);
    potentialMatch.push(contestant);

    if (potentialMatch.length !== Group.SIZE) {
      return null;
    }

    return Group.new(
      potentialMatch.map((c) => GroupMember.create(c.id)),
      currentDate,
    );
  }
}
