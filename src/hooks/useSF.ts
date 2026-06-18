import { useMemo } from 'react';
import { useStore } from './useStore';
import { rfactor, REGIONS } from '../lib/constants';

export function useSF(): number {
  const { scope, selectedRegions, selectedFo } = useStore();

  return useMemo(() => {
    if (scope === 'rf') return 1;
    if (scope === 'fo') {
      const group = REGIONS.find(g => g.fo === selectedFo);
      if (!group) return 1;
      return group.list.reduce((sum, region) => sum + rfactor(region), 0);
    }
    if (!selectedRegions || selectedRegions.length === 0) return 0.11;
    return selectedRegions.reduce((sum, region) => sum + rfactor(region), 0);
  }, [scope, selectedRegions, selectedFo]);
}
