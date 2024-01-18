import { Type } from '@mikro-orm/core';
import { GUID } from 'src/shared-kernel/ddd/GUID';

export class ORMGuid extends Type<GUID, string> {
  public override convertToDatabaseValue(value: GUID): string {
    return value.value;
  }

  public override convertToJSValue(value: string): GUID {
    return GUID.from(value);
  }

  public override getColumnType(): string {
    return 'uuid';
  }
}
