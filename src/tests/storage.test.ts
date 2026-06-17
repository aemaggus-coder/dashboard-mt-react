import { describe, it, expect, beforeEach, vi } from 'vitest';
import storage from '../lib/storage';

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('get returns fallback when key missing', () => {
    expect(storage.get('missing', 'default')).toBe('default');
  });

  it('get returns null fallback by default', () => {
    expect(storage.get('missing')).toBeNull();
  });

  it('set and get roundtrip', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });

  it('remove deletes the key', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });

  it('handles localStorage unavailable gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => storage.set('key', 'value')).not.toThrow();
  });

  it('get returns fallback when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });
    expect(storage.get('key', 'fallback')).toBe('fallback');
  });
});
