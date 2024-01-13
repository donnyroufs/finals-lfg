import { randomUUID } from 'crypto';
import { ValueObject } from './ValueObject';

export class GUID extends ValueObject {
  private constructor(public readonly value: string) {
    super();
  }

  public toString(): string {
    return this.value;
  }

  public static new(): GUID {
    return new GUID(randomUUID());
  }

  // Validate whether it matches the format
  public static from(id: string): GUID {
    return new GUID(id);
  }

  public equals(vo: this): boolean {
    return this.value === vo.value;
  }
}
