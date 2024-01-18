import { AlreadyJoinedException } from 'src/modules/contestant/domain/AlreadyJoinedException';
import { CannotLeaveException } from 'src/modules/contestant/domain/CannotLeaveException';
import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { ContestantJoinedEvent } from 'src/modules/contestant/domain/ContestantJoinedEvent';
import { GUID } from 'src/shared-kernel/ddd/GUID';

describe('Contestant', () => {
  const CURRENT_DATE = new Date();
  let contestant: Contestant;

  beforeEach(() => {
    contestant = Contestant.create(false, GUID.new().value);
  });

  test('Initially did not join', () => {
    expect(contestant.joined).toBe(false);
  });

  test('Can join', () => {
    contestant.join(CURRENT_DATE);

    expect(contestant.joined).toBe(true);
  });

  test('Can leave when joined', () => {
    contestant.join(CURRENT_DATE);
    contestant.leave();

    expect(contestant.joined).toBe(false);
  });

  test('Cannot leave when not joined', () => {
    const act = (): void => contestant.leave();

    expect(act).toThrow(CannotLeaveException);
  });

  test('Cannot join when already joined', () => {
    contestant.join(CURRENT_DATE);
    const act = (): void => contestant.join(CURRENT_DATE);

    expect(act).toThrow(AlreadyJoinedException);
  });

  test(`Applies ${ContestantJoinedEvent.name} when a contestant has joined`, () => {
    contestant.join(CURRENT_DATE);

    expect(contestant.getDomainEvents()).toEqual([
      new ContestantJoinedEvent(contestant.id, CURRENT_DATE),
    ]);
  });

  test('sets joined to false when found a group', () => {
    contestant.join(CURRENT_DATE);
    contestant.foundGroup();

    expect(contestant.joined).toBe(false);
  });
});
