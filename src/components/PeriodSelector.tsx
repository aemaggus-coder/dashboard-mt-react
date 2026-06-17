import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

// PERIOD_CFG — per-tab period options (matches old dashboard)
const PERIOD_CFG = {
  exam: [
    { p: 'today', l: 'Сегодня' },
    { p: 'ytd', l: 'С начала года' },
  ],
  tsr: [
    { p: 'today', l: 'Сегодня' },
    { p: 'month', l: 'За месяц' },
    { p: 'year', l: 'За год' },
  ],
};

export default function PeriodSelector() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'executive';
  const { period, setPeriod } = useStore();
  const cfg = PERIOD_CFG[activeTab];

  // If current period is not valid for this tab, reset to the first option (today)
  useEffect(() => {
    if (cfg && !cfg.some((x) => x.p === period)) {
      setPeriod(cfg[0].p);
    }
  }, [cfg, period, setPeriod]);

  if (!cfg) return null;

  return (
    <div className={`period-toggle period-toggle-${activeTab}`}>
      {cfg.map((x) => (
        <button
          key={x.p}
          className={`period-btn ${period === x.p ? 'active' : ''}`}
          onClick={() => setPeriod(x.p)}
        >
          {x.l}
        </button>
      ))}
    </div>
  );
}
