import { BASE, REGIONS, rfactor } from '../lib/constants';
import type { IDataService, DashboardSummary, RegionStats } from './types';
import type { Period, BaseData } from '../types';

// Mock implementation — заменить на реальные fetch-вызовы при подключении бэкенда.
// Все методы возвращают Promise чтобы API был совместим с будущим async-кодом.

class MockDataService implements IDataService {
  async getBaseData(): Promise<BaseData> {
    return Promise.resolve(BASE as unknown as BaseData);
  }

  async getSummary(period: Period): Promise<DashboardSummary> {
    const exam = BASE.exam[period] ?? BASE.exam.today;
    const tsr  = BASE.tsr[period]  ?? BASE.tsr.today;
    return Promise.resolve({
      population: {
        total:    BASE.total,
        adults:   BASE.adults,
        children: BASE.children,
        veterans: BASE.veterans,
      },
      exam,
      tsr,
      updatedAt: new Date().toISOString(),
    } as DashboardSummary);
  }

  async getRegionStats(region: string): Promise<RegionStats> {
    const foGroup = REGIONS.find(g => g.list.includes(region));
    return Promise.resolve({
      region,
      fo:          foGroup?.fo ?? 'Неизвестно',
      scaleFactor: rfactor(region),
    });
  }
}

export const dataService: IDataService = new MockDataService();
