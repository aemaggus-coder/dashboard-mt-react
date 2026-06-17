import { describe, it, expect } from 'vitest';
import { rfactor, applyScaleToValue, applyScaleToArray, applyScaleToObject, REGIONS, ALL_REGIONS } from '../lib/constants';

describe('rfactor', () => {
  it('returns a value in expected range [0.004, 0.03]', () => {
    const v = rfactor('Московская область');
    expect(v).toBeGreaterThanOrEqual(0.004);
    expect(v).toBeLessThanOrEqual(0.03);
  });

  it('is deterministic for same input', () => {
    expect(rfactor('Брянская область')).toBe(rfactor('Брянская область'));
  });

  it('returns different values for different regions', () => {
    expect(rfactor('Брянская область')).not.toBe(rfactor('Белгородская область'));
  });
});

describe('applyScaleToValue', () => {
  it('scales numeric value', () => {
    expect(applyScaleToValue(1000, 0.5)).toBe(500);
  });

  it('returns non-number as-is', () => {
    expect(applyScaleToValue('text' as unknown as number, 0.5)).toBe('text');
  });
});

describe('applyScaleToArray', () => {
  it('scales all values', () => {
    expect(applyScaleToArray([100, 200, 300], 0.5)).toEqual([50, 100, 150]);
  });
});

describe('applyScaleToObject', () => {
  it('scales specified keys', () => {
    const obj = { total: 1000, rate: 50, label: 'test' };
    const result = applyScaleToObject(obj, 0.5, ['total']);
    expect(result.total).toBe(500);
    expect(result.rate).toBe(50); // not scaled
    expect(result.label).toBe('test'); // string unchanged
  });
});

describe('REGIONS / ALL_REGIONS', () => {
  it('REGIONS has 9 federal districts', () => {
    expect(REGIONS).toHaveLength(9);
  });

  it('ALL_REGIONS includes Moscow', () => {
    expect(ALL_REGIONS).toContain('г. Москва');
  });

  it('every region belongs to exactly one FO', () => {
    const counts: Record<string, number> = {};
    ALL_REGIONS.forEach(r => { counts[r] = (counts[r] ?? 0) + 1; });
    const duplicates = Object.entries(counts).filter(([, c]) => c > 1);
    expect(duplicates).toHaveLength(0);
  });
});
