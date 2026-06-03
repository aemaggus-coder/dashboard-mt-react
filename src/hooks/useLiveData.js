import { useEffect, useState } from 'react';
import { jitter } from '../lib/constants';

export function useLiveData(data, updateInterval = 5000) {
  const [liveData, setLiveData] = useState(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        if (typeof prev === 'number') {
          return jitter(prev, 0.002);
        }
        if (Array.isArray(prev)) {
          return prev.map(v => (typeof v === 'number' ? jitter(v, 0.002) : v));
        }
        if (typeof prev === 'object') {
          const result = { ...prev };
          Object.keys(result).forEach(key => {
            if (typeof result[key] === 'number') {
              result[key] = jitter(result[key], 0.002);
            } else if (Array.isArray(result[key])) {
              result[key] = result[key].map(v => (typeof v === 'number' ? jitter(v, 0.002) : v));
            }
          });
          return result;
        }
        return prev;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return liveData;
}
