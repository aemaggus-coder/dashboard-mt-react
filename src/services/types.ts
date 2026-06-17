import type { Period, BaseData, ExamPeriodData, TsrPeriodData } from '../types';

// API contract — когда придёт реальный бэкенд, только этот файл нужно поменять

export interface DashboardSummary {
  population: {
    total: number;
    adults: number;
    children: number;
    veterans: number;
  };
  exam: ExamPeriodData;
  tsr: TsrPeriodData;
  updatedAt: string;
}

export interface RegionStats {
  region: string;
  fo: string;
  scaleFactor: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

export interface IDataService {
  getBaseData(): Promise<BaseData>;
  getSummary(period: Period): Promise<DashboardSummary>;
  getRegionStats(region: string): Promise<RegionStats>;
}
