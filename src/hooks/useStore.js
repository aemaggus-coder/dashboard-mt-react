import { create } from 'zustand';

export const useStore = create((set) => ({
  // Тема
  theme: localStorage.getItem('mintrud-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('mintrud-theme', theme);
    set({ theme });
  },

  // Навигация
  activeTab: localStorage.getItem('mintrud-tab') || 'population',
  setActiveTab: (tab) => {
    localStorage.setItem('mintrud-tab', tab);
    set({ activeTab: tab });
  },

  // Фильтры по регионам
  selectedRegions: JSON.parse(localStorage.getItem('mintrud-regions') || '[]'),
  setSelectedRegions: (regions) => {
    localStorage.setItem('mintrud-regions', JSON.stringify(regions));
    set({ selectedRegions: regions });
  },
  scope: localStorage.getItem('mintrud-scope') || 'rf',
  setScope: (scope) => {
    localStorage.setItem('mintrud-scope', scope);
    set({ scope });
  },

  // Карта
  mapMode: 'grid',
  setMapMode: (mode) => set({ mapMode: mode }),
  d3Mode: 'score',
  setD3Mode: (mode) => set({ d3Mode: mode }),

  // Активный регион на карте
  activeRegion: null,
  setActiveRegion: (region) => set({ activeRegion: region }),
  activeFo: null,
  setActiveFo: (fo) => set({ activeFo: fo }),

  // Период для графиков
  period: localStorage.getItem('mintrud-period') || 'today',
  setPeriod: (period) => {
    localStorage.setItem('mintrud-period', period);
    set({ period });
  },
}));
