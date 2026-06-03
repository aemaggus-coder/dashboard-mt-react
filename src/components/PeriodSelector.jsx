import { useStore } from '../hooks/useStore';
import { PERIOD_LABELS } from '../lib/constants';

export default function PeriodSelector() {
  const { period, setPeriod } = useStore();

  const periods = [
    { id: 'today', label: 'Сегодня' },
    { id: 'month', label: 'Месяц' },
    { id: 'qtr', label: 'Квартал' },
    { id: 'ytd', label: 'С начала года' },
    { id: 'year', label: 'За год' },
  ];

  return (
    <div className="period-row" style={{ display: 'flex' }}>
      <div className="period-toggle">
        {periods.map((p) => (
          <button
            key={p.id}
            className={`period-btn ${period === p.id ? 'active' : ''}`}
            onClick={() => setPeriod(p.id)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: period === p.id ? '#3b82f6' : 'rgba(255,255,255,.1)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (period !== p.id) e.target.style.background = 'rgba(255,255,255,.15)';
            }}
            onMouseLeave={(e) => {
              if (period !== p.id) e.target.style.background = 'rgba(255,255,255,.1)';
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
