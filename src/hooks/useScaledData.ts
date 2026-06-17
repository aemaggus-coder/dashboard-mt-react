import { useMemo } from 'react';
import { useSF } from './useSF';
import { applyScaleToObject } from '../lib/constants';

export function useScaledData<T extends object>(data: T, keys: string[] = []): T {
  const sf = useSF();
  const keysKey = keys.join(',');

  return useMemo(() => {
    if (sf === 1) return data;
    return applyScaleToObject(data, sf, keysKey ? keysKey.split(',') : []) as T;
  }, [data, sf, keysKey]);
}
