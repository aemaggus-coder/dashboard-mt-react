import { useAnimatedValue } from '../hooks/useAnimatedValue';

export default function KpiCard({ label, value, note, status = 'ok', trend, trendIsGood }) {
  const animatedValue = useAnimatedValue(value, 500);

  const fmt = (n) => {
    if (typeof n === 'number') {
      return Math.round(n).toLocaleString('ru-RU');
    }
    return n;
  };

  return (
    <div className={`kpi ${status}`}>
      <div className="kpi-label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <div className="kpi-value">{fmt(animatedValue)}</div>
        {note && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)' }}>{note}</div>}
      </div>
      {trend !== undefined && (
        <div
          style={{
            fontSize: '11px',
            fontWeight: '600',
            marginTop: '6px',
            color: trendIsGood ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span>{parseFloat(trend) > 0 ? '▲' : '▼'}</span>
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}
