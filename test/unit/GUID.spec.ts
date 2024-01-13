import { GUID } from 'src/shared-kernel/ddd/GUID';

describe('GUID', () => {
  test('Equals is false when they are not the same', () => {
    const g1 = GUID.new();
    const g2 = GUID.new();

    expect(g1.equals(g2)).toBe(false);
  });

  test('Equals is false when they are not the same', () => {
    const g1 = GUID.new();
    const g2 = GUID.from(g1.value);

    expect(g1.equals(g2)).toBe(true);
    expect(g1.equals(g1)).toBe(true);
  });
});
