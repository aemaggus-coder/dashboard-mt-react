import { useMemo } from 'react';
import { useStore } from './useStore';
import { rfactor } from '../lib/constants';

export function useSF(): number {
  const { scope, selectedRegions } = useStore();

  return useMemo(() => {
    if (scope === 'rf') return 1;
    if (scope === 'fo') return 0.4;
    if (!selectedRegions || selectedRegions.length === 0) return 0.11;
    return selectedRegions.reduce((sum, region) => sum + rfactor(region), 0);
  }, [scope, selectedRegions]);
}
