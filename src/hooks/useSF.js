import { useMemo } from 'react';
import { useStore } from './useStore';
import { rfactor } from '../lib/constants';

// sf() - returns scale factor (0.004...1) based on scope and selected regions
// RF (Россия) = 1
// FO (Федеральные округа) = 0.4
// No regions selected = 0.11
// Multiple regions = sum of rfactor() for each region
export function useSF() {
  const { scope, selectedRegions } = useStore();

  return useMemo(() => {
    if (scope === 'rf') return 1;
    if (scope === 'fo') return 0.4;
    if (!selectedRegions || selectedRegions.length === 0) return 0.11;
    return selectedRegions.reduce((sum, region) => sum + rfactor(region), 0);
  }, [scope, selectedRegions]);
}
