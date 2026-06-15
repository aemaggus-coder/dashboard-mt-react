import { useMemo } from 'react';
import { useSF } from './useSF';
import { applyScaleToObject } from '../lib/constants';

export function useScaledData(data, keys = []) {
  const sf = useSF();
  // keys is a literal array at each call-site — join to a string so useMemo
  // compares by value and doesn't re-run on every render.
  const keysKey = keys.join(',');

  return useMemo(() => {
    if (sf === 1) return data;
    return applyScaleToObject(data, sf, keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sf, keysKey]);
}
