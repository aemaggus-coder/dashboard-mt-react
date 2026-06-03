import { useMemo } from 'react';
import { useStore } from './useStore';
import { calculateScaleFactor, applyScaleToObject } from '../lib/constants';

export function useScaledData(data, keys = []) {
  const { scope, selectedRegions } = useStore();

  return useMemo(() => {
    const scale = calculateScaleFactor(scope, selectedRegions);
    if (scale === 1) return data;
    return applyScaleToObject(data, scale, keys);
  }, [data, scope, selectedRegions, keys]);
}
