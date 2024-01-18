import { Contestant } from 'src/modules/contestant/domain/Contestant';
import { GUID } from 'src/shared-kernel/ddd/GUID';
import { IBuilder } from './IBuilder';

export class TestContestantBuilder implements IBuilder<Contestant> {
  private _joined = false;
  private _userId: string;

  public asJoined(): this {
    this._joined = true;
    return this;
  }

  public asNotJoined(): this {
    this._joined = false;
    return this;
  }

  public withUserId(id: string): this {
    this._userId = id;
    return this;
  }

  public build(): Contestant {
    return Contestant.create(this._joined, this._userId ?? GUID.new().value);
  }

  public static aContestant(): TestContestantBuilder {
    return new TestContestantBuilder().asNotJoined();
  }
}
