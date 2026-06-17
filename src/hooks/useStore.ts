import { create } from 'zustand';
import storage from '../lib/storage';
import type { StoreState, Scope, Period, IssueMode, Theme } from '../types';

const VALID_SCOPES      = new Set<Scope>(['rf', 'fo', 'reg']);
const VALID_PERIODS     = new Set<Period>(['today', 'month', 'qtr', 'ytd', 'year']);
const VALID_ISSUE_MODES = new Set<IssueMode>(['all', 'nat', 'cert']);
const VALID_THEMES      = new Set<Theme>(['dark', 'light']);

const scopeFromStorage  = (): Scope  => { const v = storage.get('mintrud-scope', 'rf')  as Scope;  return VALID_SCOPES.has(v)       ? v : 'rf'; };
const periodFromStorage = (): Period => { const v = storage.get('mintrud-period', 'today') as Period; return VALID_PERIODS.has(v)     ? v : 'today'; };
const issueModeFromStorage = (): IssueMode => { const v = storage.get('tsr-issue-mode', 'all') as IssueMode; return VALID_ISSUE_MODES.has(v) ? v : 'all'; };

export const useStore = create<StoreState>((set) => ({
  theme: (storage.get('mintrud-theme', 'dark') as Theme) || 'dark',
  setTheme: (theme) => {
    if (!VALID_THEMES.has(theme)) return;
    storage.set('mintrud-theme', theme);
    set({ theme });
  },

  focusTarget: null,
  setFocusTarget: (target) => set({ focusTarget: target }),

  selectedRegions: JSON.parse(storage.get('mintrud-regions', '[]') ?? '[]') as string[],
  setSelectedRegions: (regions) => {
    storage.set('mintrud-regions', JSON.stringify(regions));
    set({ selectedRegions: regions });
  },

  scope: scopeFromStorage(),
  setScope: (scope) => {
    if (!VALID_SCOPES.has(scope)) return;
    storage.set('mintrud-scope', scope);
    set({ scope });
  },

  mapMode: 'grid',
  setMapMode: (mode) => set({ mapMode: mode }),
  d3Mode: 'score',
  setD3Mode: (mode) => set({ d3Mode: mode }),

  selectedFo: storage.get('mintrud-fo', null),
  setSelectedFo: (fo) => {
    if (fo) storage.set('mintrud-fo', fo);
    else storage.remove('mintrud-fo');
    set({ selectedFo: fo });
  },

  activeRegion: null,
  setActiveRegion: (region) => set({ activeRegion: region }),
  activeFo: null,
  setActiveFo: (fo) => set({ activeFo: fo }),

  period: periodFromStorage(),
  setPeriod: (period) => {
    if (!VALID_PERIODS.has(period)) return;
    storage.set('mintrud-period', period);
    set({ period });
  },

  issueMode: issueModeFromStorage(),
  setIssueMode: (mode) => {
    if (!VALID_ISSUE_MODES.has(mode)) return;
    storage.set('tsr-issue-mode', mode);
    set({ issueMode: mode });
  },

  syncFromStorage: () => {
    let regions: string[] = [];
    try { regions = JSON.parse(storage.get('mintrud-regions', '[]') ?? '[]'); } catch { /* ignore */ }
    set({
      selectedRegions: Array.isArray(regions) ? regions : [],
      scope: scopeFromStorage(),
      selectedFo: storage.get('mintrud-fo', null),
    });
  },
}));
