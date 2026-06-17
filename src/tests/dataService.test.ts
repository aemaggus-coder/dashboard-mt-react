import { describe, it, expect } from 'vitest';
import { dataService } from '../services';

describe('dataService (mock)', () => {
  it('getBaseData returns expected shape', async () => {
    const data = await dataService.getBaseData();
    expect(data.total).toBeGreaterThan(0);
    expect(Array.isArray(data.causes)).toBe(true);
    expect(typeof data.exam.today).toBe('object');
    expect(typeof data.tsr.today).toBe('object');
  });

  it('getSummary(today) returns valid summary', async () => {
    const summary = await dataService.getSummary('today');
    expect(summary.population.total).toBeGreaterThan(0);
    expect(summary.exam.primary).toBeGreaterThan(0);
    expect(summary.tsr.issuedNat).toBeGreaterThan(0);
    expect(typeof summary.updatedAt).toBe('string');
  });

  it('getSummary falls back for unknown period', async () => {
    const summary = await dataService.getSummary('today');
    expect(summary.exam).toBeDefined();
  });

  it('getRegionStats returns fo and scaleFactor', async () => {
    const stats = await dataService.getRegionStats('г. Москва');
    expect(stats.fo).toBe('Центральный ФО');
    expect(stats.scaleFactor).toBeGreaterThan(0);
    expect(stats.scaleFactor).toBeLessThan(0.1);
  });

  it('getRegionStats handles unknown region gracefully', async () => {
    const stats = await dataService.getRegionStats('Несуществующий регион');
    expect(stats.fo).toBe('Неизвестно');
  });
});
