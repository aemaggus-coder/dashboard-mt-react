import { describe, it, expect } from 'vitest';
import { fmt, fmt1 } from '../lib/formatters';

// Use the runtime locale output as ground truth — avoids hardcoding   vs
const RU = (n: number, opts?: Intl.NumberFormatOptions) => n.toLocaleString('ru-RU', opts);

describe('fmt', () => {
  it('formats integer with Russian locale', () => {
    expect(fmt(1234567)).toBe(RU(1234567));
  });

  it('rounds float to integer', () => {
    expect(fmt(1234.6)).toBe(RU(1235));
  });

  it('returns dash for NaN', () => {
    expect(fmt(NaN)).toBe('—');
  });

  it('returns dash for Infinity', () => {
    expect(fmt(Infinity)).toBe('—');
  });

  it('returns dash for null', () => {
    expect(fmt(null as unknown as number)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(fmt(undefined as unknown as number)).toBe('—');
  });

  it('returns dash for string', () => {
    expect(fmt('abc' as unknown as number)).toBe('—');
  });

  it('formats zero', () => {
    expect(fmt(0)).toBe('0');
  });
});

describe('fmt1', () => {
  it('formats with 1 decimal', () => {
    expect(fmt1(12.3456)).toBe(RU(12.3, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  });

  it('pads integer to 1 decimal', () => {
    expect(fmt1(100)).toBe(RU(100, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  });

  it('returns dash for NaN', () => {
    expect(fmt1(NaN)).toBe('—');
  });

  it('returns dash for null', () => {
    expect(fmt1(null as unknown as number)).toBe('—');
  });
});
