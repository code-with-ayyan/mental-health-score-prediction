import { useEffect, useState } from 'react';
import { checkApiAvailability } from '../services/predictionApi';

/** Polls the API root and reports 'checking', 'online' or 'offline'. */
export function useApiStatus(intervalMs = 30000) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    const run = async () => {
      const isOnline = await checkApiAvailability();
      if (active) setStatus(isOnline ? 'online' : 'offline');
    };

    run();
    const timerId = setInterval(run, intervalMs);
    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [intervalMs]);

  return status;
}
