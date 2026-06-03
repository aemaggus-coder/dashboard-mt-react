import { useMemo } from 'react';
import { useStore } from './useStore';
import { applyScaleToObject, rfactor } from '../lib/constants';

export function useScaledData(data, keys = []) {
  const { scope, selectedRegions } = useStore();

  return useMemo(() => {
    // Calculate scale factor (sf()) based on scope and selected regions
    let scale;
    if (scope === 'rf') {
      scale = 1;
    } else if (scope === 'fo') {
      scale = 0.4;
    } else if (!selectedRegions || selectedRegions.length === 0) {
      scale = 0.11;
    } else {
      // Sum rfactor for each selected region
      scale = selectedRegions.reduce((sum, region) => sum + rfactor(region), 0);
    }

    if (scale === 1) return data;
    return applyScaleToObject(data, scale, keys);
  }, [data, scope, selectedRegions, keys]);
}
