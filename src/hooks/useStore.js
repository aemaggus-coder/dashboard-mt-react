import { create } from 'zustand';

export const useStore = create((set) => ({
  // Тема
  theme: localStorage.getItem('mintrud-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('mintrud-theme', theme);
    set({ theme });
  },

  // Навигация
  activeTab: localStorage.getItem('mintrud-tab') || 'executive',
  setActiveTab: (tab) => {
    localStorage.setItem('mintrud-tab', tab);
    set({ activeTab: tab });
  },
  focusTarget: null,
  setFocusTarget: (target) => set({ focusTarget: target }),

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

  // Режим выдачи ТСР (натуральные / сертификат)
  issueMode: localStorage.getItem('tsr-issue-mode') || 'nat',
  setIssueMode: (mode) => {
    localStorage.setItem('tsr-issue-mode', mode);
    set({ issueMode: mode });
  },

  // Синхронизация из localStorage (вызывается при возврате с карты)
  syncFromStorage: () => {
    const regions = JSON.parse(localStorage.getItem('mintrud-regions') || '[]');
    const scope = localStorage.getItem('mintrud-scope') || 'rf';
    set({ selectedRegions: regions, scope });
  },
}));

// Слушаем изменения localStorage из iframe карты (storage event приходит в родительское окно)
window.addEventListener('storage', (e) => {
  if (e.key === 'mintrud-regions') {
    try { useStore.setState({ selectedRegions: JSON.parse(e.newValue || '[]') }); } catch {}
  }
  if (e.key === 'mintrud-scope') {
    useStore.setState({ scope: e.newValue || 'rf' });
  }
});
