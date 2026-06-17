// Единая точка входа для слоя данных.
// Чтобы переключиться на реальный API:
//   1. Создай src/services/realApi.ts реализующий IDataService
//   2. Замени импорт ниже на realApi

export { dataService } from './mockApi';
export type { IDataService, DashboardSummary, RegionStats, ApiResponse } from './types';
